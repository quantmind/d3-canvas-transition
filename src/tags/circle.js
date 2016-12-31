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
