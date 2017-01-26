import {map} from 'd3-collection';
import {timeout} from 'd3-timer';
import transform from './attrs/transform';

import {getColor} from './attrs/style';
import getSize from './size';

export var tagDraws = map();


export function touch (node, v) {
    var root = node.rootNode;
    if (!root._touches) root._touches = 0;
    root._touches += v;
    if (!root._touches || root._scheduled) return;
    root._scheduled = timeout(redraw(root));
}


export function draw (node, point) {
    var children = node.countNodes,
        drawer = tagDraws.get(node.tagName),
        factor = node.factor,
        attrs = node.attrs;

    if (drawer === false)
        return;
    else if (node.attrs) {
        var ctx = node.context,
            stroke, width;

        // save the current context
        ctx.save();
        //
        if (attrs['$opacity'] !== undefined) ctx.globalAlpha = +attrs['$opacity'];
        if (attrs['$stroke-linecap']) ctx.lineCap = attrs['$stroke-linecap'];
        if (attrs['$stroke-linejoin']) ctx.lineJoin = attrs['$stroke-linejoin'];
        if (attrs['$mix-blend-mode']) ctx.globalCompositeOperation = attrs['$mix-blend-mode'];
        transform(node);
        //
        // Stroke
        stroke = node.getValue('stroke');
        if (stroke === 'none')
            stroke = false;
        else {
            stroke = getColor(node, node.getValue('stroke'), node.getValue('stroke-opacity'));
            if (stroke) ctx.strokeStyle = stroke;
            if (attrs['$stroke-width'] !== undefined) {
                width = getSize(node.attrs['$stroke-width']);
                if (width) ctx.lineWidth = factor * width;
            }
            stroke = width === 0 ? false : true;
        }
        //
        // Fill
        var fill = getColor(node, node.getValue('fill'), node.getValue('fill-opacity'));
        if (fill) ctx.fillStyle = fill;
        fill === 'none' || !fill ? false : true;
        //
        if (drawer) drawer(node, stroke, fill, point);
        if (children) node.each((child) => draw(child, point));
        //
        // restore
        ctx.restore();
    } else if (children) {
        node.each((child) => draw(child, point));
    }
}


export function redraw (node, point, force) {

    return function () {
        if (!node._scheduled && !force) return;
        var ctx = node.context;
        node._touches = 0;
        ctx.beginPath();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (point) point.nodes = [];
        draw(node, point);
        node._scheduled = false;
        touch(node, 0);
        return point ? point.nodes : null;
    };
}
