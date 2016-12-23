import {map} from 'd3-collection';

import {StyleNode} from './attrs/style';
import setAttribute from './attrs/set';
import deque from './deque';
import {touch} from './draw';


const namespace = 'canvas';

/**
 * A proxy for a data entry on canvas
 *
 * It partially implements the Node Api (please pull request!)
 * https://developer.mozilla.org/en-US/docs/Web/API/Node
 *
 * It allows the use the d3-select and d3-transition libraries
 * on canvas joins
 */
export function CanvasElement (tagName, context) {
    var _deque,
        text = '';

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
        tagName: {
            get () {
                return tagName;
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
                touch(this, 1);
            }
        },
        clientLeft: {
            get () {
                return context.canvas.clientLeft;
            }
        },
        clientTop: {
            get () {
                return context.canvas.clientTop;
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
                return this.context._rootElement;
            }
        },
        factor: {
            get () {
                return this.context._factor;
            }
        }
    });
}

CanvasElement.prototype = {

    querySelectorAll (selector) {
        return this.countNodes ? select(selector, this, []) : [];
    },

    querySelector (selector) {
        if (this.countNodes) return select(selector, this);
    },

    createElementNS (namespaceURI, qualifiedName) {
        return new CanvasElement(qualifiedName, this.context);
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
        touch(this, 1);
        return child;
    },

    removeChild (child) {
        if (child._parent === this) {
            delete child._parent;
            this.deque.remove(child);
            touch(this, 1);
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
            if (setAttribute(this, attr, value)) touch(this, 1);
        }
    },

    removeAttribute (attr) {
        if (this.attrs) {
            this.attrs.remove(attr);
            touch(this, 1);
        }
    },

    getAttribute (attr) {
        var value = this.attrs ? this.attrs.get(attr) : undefined;
        if (value === undefined && !this._parent)
            value = this.context.canvas[attr];
        return value;
    },

    addEventListener () {
        var canvas = this.context.canvas;
        arguments[1] = wrapListener(this, arguments[1]);
        canvas.addEventListener.apply(canvas, arguments);
    },

    getBoundingClientRect () {
        return this.context.canvas.getBoundingClientRect();
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
        return this.root;
    }
};


function select(selector, node, selections) {

    var selectors = selector.split(' '),
        iterator = new NodeIterator(node),
        child = iterator.next(),
        classes, bits, tag, id, sel;

    for (let s=0; s<selectors.length; ++s) {
        selector = selectors[s];
        if (selector === '*') {
            selector = {};
        } else {
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
            selector = {tag, id, classes};
        }
        selectors[s] = selector;
    }

    while (child) {
        for (let s=0; s<selectors.length; ++s) {
            sel = selectors[s];

            if (!sel.tag || child.tagName === sel.tag) {
                if ((sel.id && child.id !== sel.id) ||
                    (sel.classes && child.class !== sel.classes)) {
                    // nothing to do
                }
                else if (selections) {
                    selections.push(child);
                    break;
                }
                else
                    return child;
            }
        }
        child = iterator.next();
    }

    return selections;
}


function NodeIterator (node) {
    this.node = node;
    this.current = node;
}


NodeIterator.prototype = {

    next () {
        var current = this.current;
        if (!current) return null;
        if (current.firstChild)
            current = current.firstChild;
        else {
            while (current !== this.node) {
                if (current.nextSibling) {
                    current = current.nextSibling;
                    break;
                }
                current = current.parentNode;
            }
            if (current === this.node) current = null;
        }
        this.current = current;
        return current;
    }
};

function wrapListener (node, listener) {

    return function () {
        listener.apply(node, arguments);
    };
}
