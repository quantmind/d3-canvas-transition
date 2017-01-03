import {sizeTags} from '../size';
import polygon from '../polygon';


export default function (node, stroke, fill, point) {
    var attrs = node.attrs,
        ctx = node.context,
        factor = ctx._factor,
        rx = attrs.get('rx') || 0,
        //ry = attrs.get('ry') || 0,
        height = attrs.get('height') || 0,
        width = attrs.get('width') || 0;
    if (width && height && height !== width) ctx.scale(1.0, height/width);
    if (rx) {
        polygon(ctx, [[0, 0], [factor*width, 0], [factor*width, factor*width], [0, factor*width]], factor*rx);
    }
    else {
        ctx.beginPath();
        ctx.rect(0, 0, factor*width, factor*width);
        ctx.closePath();
    }
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
