import {map} from 'd3-collection';
import {timeout} from 'd3-timer';
import setAttribute from './path';
import Deque from './deque';
import * as d3 from 'd3-color';


const
    namespace = 'canvas',
    tag_line = 'line',
    tag_text = 'text',
    defaultBaseline = 'middle',
    textAlign = {
        start: 'start',
        middle: 'center',
        end: 'end'
    };

export const fontProperties = ['style', 'variant', 'weight', 'size', 'family'];

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

    constructor (context, factor) {
        this.context = context;
        this.factor = factor || 1;
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
        var elem = new CanvasElement(this.context, this.factor);
        elem.tag = qualifiedName;
        return elem;
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
        if (!this._deque) this._deque = new Deque();
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
            attrs = this.attrs;

        if (attrs) {
            ctx.save();
            transform(this, this.attrs.get('transform'));
            ctx.save();
            if (this.tag === tag_line) drawLine(this);
            else if (this.tag === tag_text) drawText(this);
            else path(this, attrs.get('d'), t);
            fillStyle(this);
            strokeStyle(this);
            ctx.restore();
        }

        if (this._deque)
            this._deque.each((child) => {
                child.draw(t);
            });

        if (attrs) ctx.restore();
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

    var selectors = selector.split(' ');

    for (let s=0; s<selectors.length; ++s) {
        selector = selectors[s];
        var bits = selector.split('.'),
            tag = bits[0],
            classes = bits.splice(1).join(' '),
            child = deque._head;

        while (child) {
            if (!tag || child.tag === tag) {
                if (classes && child.class !== classes) {
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


function strokeStyle (node) {
    var stroke = node.attrs.get('stroke');
    if (stroke && stroke !== 'none') {
        stroke = d3.color(stroke);
        var opacity = node.getValue('stroke-opacity');
        if (opacity || opacity === 0)
            stroke.opacity = opacity;
        node.context.strokeStyle = '' + stroke;
        node.context.lineWidth = node.factor * (node.getValue('stroke-width') || 1);
        node.context.stroke();
        return stroke;
    }
}


function fillStyle (node) {
    var fill = node.attrs.get('fill');
    if (fill && fill !== 'none') {
        fill = d3.color(fill);
        var opacity = node.getValue('fill-opacity');
        if (opacity || opacity===0)
            fill.opacity = opacity;
        node.context.fillStyle = ''+fill;
        node.context.fill();
        return fill;
    }
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


function drawLine(node) {
    var attrs = node.attrs;
    node.context.moveTo(node.factor*(attrs.get('x1') || 0), node.factor*(attrs.get('y1') || 0));
    node.context.lineTo(node.factor*attrs.get('x2'), node.factor*attrs.get('y2'));
}

function drawText(node) {
    var size = fontString(node);
    node.context.textAlign = textAlign[node.getValue('text-anchor')] || textAlign.middle;
    node.context.textBaseline = node.getValue('text-baseline') || defaultBaseline;
    node.context.fillText(node.textContent || '', fontLocation(node, 'x', size), fontLocation(node, 'y', size));
}


function path(node, path) {
    if (path) {
        if (typeof(path.draw) === 'function') path.draw(node);
        else if (path.context) path.context(node.context)();
    }
}


function fontString (node) {
    let bits = [],
        size = 0,
        key, v;
    for (let i=0; i<fontProperties.length; ++i) {
        key = fontProperties[i];
        v = node.getValue('font-' + key);
        if (v) {
            if (key === 'size') {
                size = node.factor*v;
                v = size + 'px';
            }
            bits.push(v);
        }
    }
    if (size)
        node.context.font = bits.join(' ');
    return size;
}


function fontLocation (node, d, size) {
    var p = node.attrs.get(d) || 0,
        dp = node.attrs.get('d' + d) || 0;
    if (dp) {
        if (dp.substring(dp.length - 2) == 'em') dp = size * dp.substring(0, dp.length - 2);
        else if (dp.substring(dp.length - 2) == 'px') dp = +dp.substring(0, dp.length - 2);
    }
    return node.factor*(p + dp);
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
