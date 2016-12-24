import {map} from 'd3-collection';
import {timeout} from 'd3-timer';

import {strokeStyle, fillStyle} from './attrs/style';

export var tagDraws = map();

export var attributes = map();


export function touch (node, v) {
    var root = node.rootNode;
    if (!root._touches) root._touches = 0;
    root._touches += v;
    if (!root._touches || root._scheduled) return;
    root._scheduled = timeout(redraw(root));
}


function draw (node, t) {
    var children = node.countNodes,
        drawer = tagDraws.get(node.tagName);
    if (drawer === false)
        return;
    else if (node.attrs) {
        var ctx = node.context,
            stroke, fill;

        // save the current context
        ctx.save();
        //
        // apply attributes and styles
        attributes.each((attr) => attr(node, t));
        stroke = strokeStyle(node, t);
        fill = fillStyle(node, t);
        //
        if (drawer) drawer(node, stroke, fill);
        if (children) node.each((child) => draw(child, t));
        //
        // restore
        ctx.restore();
    } else if (children) {
        node.each((child) => draw(child, t));
    }
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
