import {sizeTags} from '../size';


export default function (node, stroke, fill, point) {
    var attrs = node.attrs,
        ctx = node.context,
        f = node.factor;
    ctx.beginPath();
    ctx.arc(
        f*attrs.get('cx', 0),
        f*attrs.get('cy', 0),
        f*attrs.get('r', 0),
        0, 2 * Math.PI
    );
    ctx.closePath();
    if (stroke) ctx.stroke();
    if (fill) ctx.fill();
    if (point && ctx.isPointInPath(point.x, point.y)) point.nodes.push(node);
}


sizeTags.circle = function (node) {
    var r = node.factor*(node.attrs.get('r') || 0);
    return {
        x: node.factor*(node.attrs.get('cx') || 0) - r,
        y: node.factor*(node.attrs.get('cy') || 0) - r,
        width: 2*r,
        height: 2*r
    };
};
