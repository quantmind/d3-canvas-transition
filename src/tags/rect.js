export default function (node, stroke, fill, point) {
    var attrs = node.attrs,
        ctx = node.context;
    ctx.beginPath();
    ctx.rect(0, 0, node.factor*(attrs.get('width') || 0), node.factor*(attrs.get('height') || 0));
    ctx.closePath();
    if (stroke) ctx.stroke();
    if (fill) ctx.fill();
    if (point && ctx.isPointInPath(point.x, point.y)) point.nodes.push(node);
}
