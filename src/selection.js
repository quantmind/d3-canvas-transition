import {selection, select} from 'd3-selection';

import {CanvasElement} from './element';
import resolution from './resolution';
import canvasAttr from './attrs/wrap';


const originalAttr = selection.prototype.attr;
var defaultFactor;

selection.prototype.attr = selectionAttr;
selection.prototype.canvas = asCanvas;
selection.prototype.canvasResolution = canvasResolution;


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
        var node = this._parents[0] || this.node();
        if (isCanvas(node) && typeof(value.context) === 'function') {
            value.context(node.context);
            arguments[1] = canvasAttr(value, node.factor);
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
