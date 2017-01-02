import {sizeTags} from '../size';

export default function (node, stroke, fill, point) {
    var attrs = node.attrs,
        ctx = node.context,
        height = attrs.get('height') || 0,
        width = attrs.get('width') || 0;
    if (width && height && height !== width) ctx.scale(1.0, height/width);
    ctx.beginPath();
    ctx.rect(0, 0, node.factor*width, node.factor*width);
    ctx.closePath();
    if (stroke) ctx.stroke();
    if (fill) ctx.fill();
    if (point && ctx.isPointInPath(point.x, point.y)) point.nodes.push(node);
}


sizeTags.rect = function (node) {
    var w = node.factor*(node.attrs.get('width') || 0);
    return {
        x: 0,
        y: 0,
        height: w,
        width: w
    };
};
