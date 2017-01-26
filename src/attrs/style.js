import selectCanvas from '../selection';
import getSize, {nodeDim} from '../size';

import {color} from 'd3-color';


const gradients = {

    linearGradient (node, gradNode, opacity) {
        var ctx = gradNode.context,
            dim = nodeDim(node),
            x1 = getSize(gradNode.attrs.get('x1') || '0%', dim.width),
            x2 = getSize(gradNode.attrs.get('x2') || '100%', dim.width),
            y1 = getSize(gradNode.attrs.get('y1') || '0%', dim.height),
            y2 = getSize(gradNode.attrs.get('y2') || '0%', dim.height),
            col;

        var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradNode.each((child) => {
            col = color(child.attrs.get('stop-color'));
            if (opacity || opacity === 0) col.opacity = opacity;
            gradient.addColorStop(
                getSize(child.attrs.get('offset')),
                '' + col
            );
        });
        return gradient;
    },

    radialGradient (node, gradNode, opacity) {
        var ctx = gradNode.context,
            dim = nodeDim(node),
            cx = getSize(gradNode.attrs.get('cx') || '50%', dim.width),
            cy = getSize(gradNode.attrs.get('cy') || '50%', dim.height),
            fx = getSize(gradNode.attrs.get('fx') || cx, dim.width),
            fy = getSize(gradNode.attrs.get('fy') || cy, dim.height),
            r = getSize(gradNode.attrs.get('r') || '50%', Math.max(dim.height, dim.width)),
            col;

        var gradient = ctx.createRadialGradient(dim.x + fx, dim.y + fy, 0, dim.x + cx, dim.y + cy, r);
        gradNode.each((child) => {
            col = color(child.attrs.get('stop-color'));
            if (opacity || opacity === 0) col.opacity = opacity;
            gradient.addColorStop(
                getSize(child.attrs.get('offset')),
                '' + col
            );
        });
        return gradient;
    }
};


export function getColor(node, value, opacity) {
    if (value === 'none') return false;
    if (value) {
        if (typeof(value) === 'string' && value.substring(0, 4) === 'url(') {
            var selector = value.substring(4, value.length-1),
                gradNode = selectCanvas(node.rootNode).select(selector).node();
            return gradNode ? gradient(node, gradNode, opacity) : null;
        }
        if (opacity || opacity===0) {
            var col = color(value);
            if (col) {
                col.opacity = opacity;
                return '' + col;
            }
        } else return value;
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


function gradient(node, gradNode, opacity) {
    var g = gradients[gradNode.tagName];
    if (g) return g(node, gradNode, opacity);
}
