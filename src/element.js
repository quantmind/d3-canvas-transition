import {map} from 'd3-collection';
import {timeout} from 'd3-timer';

import {strokeStyle, fillStyle, StyleNode} from './attrs/style';
import setAttribute from './attrs/set';
import deque from './deque';


const namespace = 'canvas';

export var tagDraws = map();
export var attributes = map();
/**
 * A proxy for a data entry on canvas
 *
 * It partially implements the Node Api (please pull request!)
 * https://developer.mozilla.org/en-US/docs/Web/API/Node
 *
 * It allows the use the d3-select and d3-transition libraries
 * on canvas joins
 */
export function CanvasElement (context, factor, tag) {
    var _deque,
        text = '';
    factor = factor || 1;

    Object.defineProperties(this, {
        context: {
            get () {
                return context;
            }
        },
        deque: {
            get () {
                if (!_deque) _deque = deque();
                return _deque;
            }
        },
        factor: {
            get () {
                return factor;
            }
        },
        tagName: {
            get () {
                return tag;
            }
        },
        childNodes: {
            get () {
                return _deque ? _deque.list() : [];
            }
        },
        firstChild: {
            get () {
                return _deque ? _deque._head : null;
            }
        },
        lastChild: {
            get () {
                return _deque ? _deque._tail : null;
            }
        },
        parentNode: {
            get() {
                return this._parent;
            }
        },
        previousSibling: {
            get () {
                return this._prev;
            }
        },
        nextSibling: {
            get () {
                return this._next;
            }
        },
        namespaceURI: {
            get () {
                return namespace;
            }
        },
        textContent: {
            get () {
                return text;
            },
            set (value) {
                text = ''+value;
                touch(this.root, 1);
            }
        },
        //
        // Canvas Element properties
        countNodes: {
            get () {
                return _deque ? _deque._length : 0;
            }
        },
        root: {
            get () {
                if (this._parent) return this._parent.root;
                return this;
            }
        }
    });
}

CanvasElement.prototype = {

    querySelectorAll (selector) {
        if (this.countNodes) {
            if (selector === '*') return this.childNodes;
            return select(selector, this.deque, []);
        } else
            return [];
    },

    querySelector (selector) {
        if (this.countNodes) {
            if (selector === '*') return this.deque._head;
            return select(selector, this.deque);
        }
    },

    createElementNS (namespaceURI, qualifiedName) {
        return new CanvasElement(this.context, this.factor, qualifiedName);
    },

    hasChildNodes () {
        return this.countNodes > 0;
    },

    contains (child) {
        while(child) {
            if(child._parent == this) return true;
            child = child._parent;
        }
        return false;
    },

    appendChild (child) {
        return this.insertBefore(child);
    },

    insertBefore (child, refChild) {
        if (child === this) throw Error('inserting self into children');
        if (!(child instanceof CanvasElement))
            throw Error('Cannot insert a non canvas element into a canvas element');
        if (child._parent) child._parent.removeChild(child);
        this.deque.prepend(child, refChild);
        child._parent = this;
        touch(this.root, 1);
        return child;
    },

    removeChild (child) {
        if (child._parent === this) {
            delete child._parent;
            this.deque.remove(child);
            touch(this.root, 1);
            return child;
        }
    },

    setAttribute (attr, value) {
        if (attr === 'class') {
            this.class = value;
        }
        else if (attr === 'id') {
            this.id = value;
        }
        else {
            if (!this.attrs) this.attrs = map();
            if (setAttribute(this, attr, value)) touch(this.root, 1);
        }
    },

    removeAttribute (attr) {
        if (this.attrs) {
            this.attrs.remove(attr);
            touch(this.root, 1);
        }
    },

    getAttribute (attr) {
        var value = this.attrs ? this.attrs.get(attr) : undefined;
        if (value === undefined && !this._parent)
            value = this.context.canvas[attr];
        return value;
    },

    // Canvas methods
    each (f) {
        if (this.countNodes) this.deque.each(f);
    },

    getValue (attr) {
        var value = this.getAttribute(attr);
        if (value === undefined && this._parent) return this._parent.getValue(attr);
        return value;
    },

    // Additional attribute functions
    removeProperty(name) {
        this.removeAttribute(name);
    },

    setProperty(name, value) {
        this.setAttribute(name, value);
    },

    getProperty(name) {
        return this.getAttribute(name);
    },

    getPropertyValue (name) {
        return this.getAttribute(name);
    },

    // Proxies to this object
    getComputedStyle (node) {
        return new StyleNode(node);
    },

    get ownerDocument () {
        return this;
    },

    get style () {
        return this;
    },

    get defaultView () {
        return this;
    },

    get document () {
        return this;
    }
};


function select(selector, deque, selections) {

    var selectors = selector.split(' '),
        bits, tag, child;

    for (let s=0; s<selectors.length; ++s) {
        var classes, id;

        child = deque._head;
        selector = selectors[s];

        if (selector.indexOf('#') > -1) {
            bits = selector.split('#');
            tag = bits[0];
            id = bits[1];
        }
        else if (selector.indexOf('.') > -1) {
            bits = selector.split('.');
            tag = bits[0];
            classes = bits.splice(1).join(' ');
        }
        else
            tag = selector;

        while (child) {
            if (!tag || child.tagName === tag) {
                if ((id && child.id !== id) ||
                    (classes && child.class !== classes)) {
                    // nothing to do
                }
                else if (selections)
                    selections.push(child);
                else
                    return child;
            }
            child = child._next;
        }
    }

    return selections;
}


function touch(node, v) {
    if (!node._touches) node._touches = 0;
    node._touches += v;
    if (!node._touches || node._scheduled) return;
    node._scheduled = timeout(redraw(node));
}


function draw (node, t) {
    if (node.attrs) {
        var ctx = node.context,
            drawer = tagDraws.get(node.tagName);

        ctx.save();
        attributes.each((attr) => attr(node, t));
        strokeStyle(node, t);
        fillStyle(node, t);
        ctx.save();
        if (drawer) drawer(node, t);
        //
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    node.each((child) => draw(child, t));
    if (node.attrs) ctx.restore();
}


function redraw (node) {

    return function () {
        var ctx = node.context;
        node._touches = 0;
        ctx.beginPath();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        draw(node);
        node._scheduled = false;
        touch(node, 0);
    };
}
