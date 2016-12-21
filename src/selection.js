import {selection, select} from 'd3-selection';

import {CanvasElement} from './element';
import resolution from './utils';
import canvasAttr from './attrs/wrap';


const originalAttr = selection.prototype.attr;

selection.prototype.attr = selectionAttr;


export default function (context, factor) {
    var s = selection();
    if (!context) return s;
    if (typeof(context) === 'string') {
        context = select(context).node();
        if (!context) return s;
    }
    if (context.getContext) context = context.getContext('2d');
    if (!factor) factor = resolution();
    s = s.select(function () {
        return new CanvasElement(context, factor, 'canvas');
    });
    s.reset = resetCanvas;
    return s;
}


function selectionAttr (name, value) {
    if (arguments.length > 1) {
        var node = this._parents[0] || this.node();
        if (node instanceof CanvasElement && typeof(value.context) === 'function') {
            value.context(node.context);
            arguments[1] = canvasAttr(value, node.factor);
        }
    }
    return originalAttr.apply(this, arguments);
}



function resetCanvas () {
    var node = this.node(),
        ctx = node.context,
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
    return this;
}
