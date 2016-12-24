import selectCanvas from '../selection';
import getSize from '../size';

import {color} from 'd3-color';


const gradients = {

    linearGradient (node, opacity) {
        var ctx = node.context,
            canvas = ctx.canvas,
            x1 = getSize(node.attrs.get('x1', '0%'), canvas.width),
            x2 = getSize(node.attrs.get('x2', '100%'), canvas.width),
            y1 = getSize(node.attrs.get('y1', '0%'), canvas.height),
            y2 = getSize(node.attrs.get('y2', '0%'), canvas.height),
            col;

        var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        node.each((child) => {
            col = color(child.attrs.get('stop-color'));
            if (opacity || opacity === 0) col.opacity = opacity;
            gradient.addColorStop(
                getSize(child.attrs.get('offset')),
                '' + col
            );
        });
        return gradient;
    },

    radialGradient () {

    }
};


export function strokeStyle (node) {
    var ctx = node.context,
        stroke = getColor(node, node.attrs.get('stroke'), node.getValue('stroke-opacity')),
        width = getSize(node.attrs.get('stroke-width'));
    if (width) ctx.lineWidth = node.factor * width;
    if (stroke) ctx.strokeStyle = stroke;
    return stroke;
}


export function fillStyle (node) {
    var ctx = node.context,
        fill = getColor(node, node.attrs.get('fill'), node.getValue('fill-opacity'));
    if (fill) ctx.fillStyle = fill;
    return fill;
}


function getColor(node, value, opacity) {
    if (value && value !== 'none') {
        if (typeof(value) === 'string' && value.substring(0, 4) === 'url(') {
            var selector = value.substring(4, value.length-1);
            node = selectCanvas(node.rootNode).select(selector).node();
            return node ? gradient(node, opacity) : null;
        }
        var col = color(value);
        if (col) {
            if (opacity || opacity===0)
                col.opacity = opacity;
            return '' + col;
        }
    }
}


export function StyleNode (node) {
    this.node = node;
}


StyleNode.prototype = {

    getPropertyValue (name) {
        var value = this.node.getValue(name);
        if (value === undefined)
            value = window.getComputedStyle(this.node.context.canvas).getPropertyValue(name);
        return value;
    }

};


function gradient(node, opacity) {
    var g = gradients[node.tagName];
    if (g) return g(node, opacity);
}
