export default function (node, stroke, fill, point) {
    var attrs = node.attrs,
        factor = node.factor,
        ctx = node.context;
    ctx.beginPath();
    ctx.moveTo(factor*(attrs['$x1'] || 0), factor*(attrs['$y1'] || 0));
    ctx.lineTo(factor*attrs['$x2'], factor*attrs['$y2']);
    if (stroke) ctx.stroke();
    if (point && ctx.isPointInPath(point.x, point.y)) point.nodes.push(node);
}
