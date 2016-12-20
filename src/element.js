import {map} from 'd3-collection';
import {timeout} from 'd3-timer';

import {strokeStyle, fillStyle} from './style';
import setAttribute from './path';
import deque from './deque';


const namespace = 'canvas';

export var tagDraws = map();
/**
 * A proxy for a data entry on canvas
 *
 * It partially implements the Node Api
 * https://developer.mozilla.org/en-US/docs/Web/API/Node
 *
 * It allow the use the d3-select and d3-transition libraries
 * on canvas joins
 */
export class CanvasElement {

    constructor (context, factor, tag) {
        this.context = context;
        this.factor = factor || 1;
        this.tagName = tag || 'canvas';
    }

    // API
    get childNodes () {
        return this._deque ? this._deque.list(): [];
    }

    get firstChild () {
        return this._deque ? this._deque._head : null;
    }

    get lastChild () {
        return this._deque ? this._deque._tail : null;
    }

    get parentNode () {
        return this._parent;
    }

    get previousSibling () {
        return this._prev;
    }

    get nextSibling () {
        return this._next;
    }

    querySelectorAll (selector) {
        if (this._deque) {
            if (selector === '*') return this.childNodes;
            return select(selector, this._deque, []);
        } else
            return [];
    }

    querySelector (selector) {
        if (this._deque) {
            if (selector === '*') return this._deque._head;
            return select(selector, this._deque);
        }
    }

    createElementNS (namespaceURI, qualifiedName) {
        return new CanvasElement(this.context, this.factor, qualifiedName);
    }

    hasChildNodes () {
        return this._deque ? this._deque.length > 0 : false;
    }

    contains (child) {
        while(child) {
            if(child._parent == this) return true;
            child = child._parent;
        }
        return false;
    }

    appendChild (child) {
        return this.insertBefore(child);
    }

    insertBefore (child, refChild) {
        if (child === this) throw Error('inserting self into children');
        if (!(child instanceof CanvasElement))
            throw Error('Cannot insert a non canvas element into a canvas element');
        if (child._parent) child._parent.removeChild(child);
        if (!this._deque) this._deque = deque();
        this._deque.prepend(child, refChild);
        child._parent = this;
        touch(this.root, 1);
        return child;
    }

    removeChild (child) {
        if (child._parent === this) {
            delete child._parent;
            this._deque.remove(child);
            touch(this.root, 1);
            return child;
        }
    }

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
    }

    removeAttribute (attr) {
        if (this.attrs) {
            this.attrs.remove(attr);
            touch(this.root, 1);
        }
    }

    getAttribute (attr) {
        if (this.attrs) return this.attrs.get(attr);
    }

    get namespaceURI () {
        return namespace;
    }

    // Canvas methods
    get countNodes () {
        return this._deque ? this._deque._length : 0;
    }

    get root () {
        if (this._parent) return this._parent.root;
        return this;
    }

    draw (t) {
        var ctx = this.context,
            drawer = tagDraws.get(this.tagName);

        if (this.attrs) {
            ctx.save();
            transform(this, this.attrs.get('transform'));
            ctx.save();
            if (drawer) drawer(this, t);
            fillStyle(this);
            strokeStyle(this);
            ctx.restore();
        }

        if (this._deque)
            this._deque.each((child) => {
                child.draw(t);
            });

        if (this.attrs) ctx.restore();
    }

    each (f) {
        if (this._deque) this._deque.each(f);
    }

    getValue (attr) {
        var value = this.getAttribute(attr);
        if (value === undefined && this._parent) return this._parent.getValue(attr);
        return value;
    }

    // Additional attribute functions
    removeProperty(name) {
        this.removeAttribute(name);
    }

    setProperty(name, value) {
        this.setAttribute(name, value);
    }

    getProperty(name) {
        return this.getAttribute(name);
    }

    getPropertyValue (name) {
        return this.getAttribute(name);
    }

    // Proxies to this object
    getComputedStyle () {
        return this;
    }

    get ownerDocument () {
        return this;
    }

    get style () {
        return this;
    }

    get defaultView () {
        return this;
    }

    get document () {
        return this;
    }
    //
    onStart () {
        return;
    }
}


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


function transform(node, trans) {
    if (!trans) return;
    var index1 = trans.indexOf('translate('),
        index2, s, bits;
    if (index1 > -1) {
        s = trans.substring(index1+10);
        index2 = s.indexOf(')');
        bits = s.substring(0, index2).split(',');
        node.context.translate(node.factor*bits[0], node.factor*bits[1]);
    }
    return true;
}


function touch(node, v) {
    if (!node._touches) node._touches = 0;
    node._touches += v;
    if (!node._touches || node._inloop) return;
    node._inloop = timeout(redraw(node));
}


function redraw (node) {

    return function () {
        var ctx = node.context;
        node._touches = 0;
        ctx.beginPath();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        node.draw();
        node._inloop = false;
        touch(node, 0);
    };
}
