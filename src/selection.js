import {selection, select} from 'd3-selection';

import {CanvasElement} from './element';
import resolution from './resolution';
import path from './attrs/path';
import {draw, redraw} from './draw';


var originalAttr = selection.prototype.attr;
var defaultFactor;


selection.prototype.attr = selectionAttr;
selection.prototype.canvas = asCanvas;
selection.prototype.canvasResolution = canvasResolution;
selection.prototype.draw = drawNode;



export default function selectCanvas (context, factor) {
    var s = selection();
    if (!context) return s;

    if (isCanvas(context) && arguments.length === 1)
        return s.select(() => context);

    if (typeof(context) === 'string') {
        context = select(context).node();
        if (!context) return s;
    }
    if (context.getContext) context = context.getContext('2d');

    if (!context._rootElement) {
        if (!factor) factor = defaultFactor || resolution();
        context._factor = factor;
        context._rootElement = new CanvasElement('canvas', context);
    }
    return s.select(() => context._rootElement);
}


function selectionAttr (name, value) {
    if (arguments.length > 1) {
        var node = this._parents[0] || this.node(),
            attr;
        if (isCanvas(node) && typeof(value.context) === 'function') {
            attr = value.pathObject;
            if (!attr) {
                attr = path(value);
                value.pathObject = attr;
            }
            if (!value.context())
                value.context(wrapContext(node.context, node.factor));
            arguments[1] = attr;
        }
    }
    return originalAttr.apply(this, arguments);
}


function isCanvas(node) {
    return node instanceof CanvasElement;
}


function asCanvas (reset) {
    var s = this,
        node = s.node();

    if (node.tagName === 'CANVAS' && !isCanvas(node)) {
        s = selectCanvas(node);
        node = s.node();
    }

    if (isCanvas(node) && reset) {
        var ctx = node.context,
            factor = node.factor,
            width = ctx.canvas.width,
            height = ctx.canvas.height;
        ctx.beginPath();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
        if (factor > 1) {
            ctx.canvas.style.width = width + 'px';
            ctx.canvas.style.height = height + 'px';
            ctx.canvas.width = width * factor;
            ctx.canvas.height = height * factor;
            ctx.scale(factor, factor);
        }
    }

    return s;
}


function canvasResolution (value) {
    if (arguments.length === 1) {
        defaultFactor = value;
        return this;
    }
    return this.factor;
}


function drawNode () {
    var node = this.node();
    if (isCanvas(node)) {
        var root = node.rootNode;
        if (root === node) redraw(node)();
        else {
            if (root._scheduled) {
                root._scheduled = null;
                root._touches = 0;
            }
            draw(node);
        }
    }
    return this;
}


function wrapContext(context, factor) {
    if (factor === 1) return context;
    return new Context(context, factor);
}


function Context (context, factor) {
    this._context = context;
    this._factor = 1;
    this._f = factor;
}


Context.prototype = {
    beginPath () {
        this._context.beginPath();
    },
    closePath () {
        this._context.closePath();
    },
    moveTo (x, y) {
        this._context.moveTo(this._f*x, this._f*y);
    },
    lineTo (x, y) {
        this._context.lineTo(this._f*x, this._f*y);
    },
    arc () {
        arguments[0] = this._f*arguments[0];
        arguments[1] = this._f*arguments[1];
        arguments[2] = this._f*arguments[2];
        this._context.arc.apply(this._context, arguments);
    },
    rect (x, y, w, h) {
        this._context.rect(this._f*x, this._f*y, this._f*w, this._f*h);
    },
    quadraticCurveTo (cpx, cpy, x, y) {
        this._context.quadraticCurveTo(this._f*cpx, this._f*cpy, this._f*x, this._f*y);
    },
    bezierCurveTo (cp1x,cp1y,cp2x,cp2y,x,y) {
        this._context.bezierCurveTo(
            this._f*cp1x, this._f*cp1y,
            this._f*cp2x, this._f*cp2y, this._f*x, this._f*y
        );
    }
};
