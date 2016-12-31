export default function (node, stroke, fill, point) {
    var attrs = node.attrs,
        ctx = node.context;
    ctx.moveTo(node.factor*(attrs.get('x1') || 0), node.factor*(attrs.get('y1') || 0));
    ctx.lineTo(node.factor*attrs.get('x2'), node.factor*attrs.get('y2'));
    if (stroke) ctx.stroke();
    //if (fill) ctx.fill();
    if (point && ctx.isPointInPath(point.x, point.y)) point.nodes.push(node);
}
