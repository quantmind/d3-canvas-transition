export default function (node, stroke, fill) {
    var attrs = node.attrs,
        ctx = node.context;
    ctx.moveTo(node.factor*(attrs.get('x1') || 0), node.factor*(attrs.get('y1') || 0));
    ctx.lineTo(node.factor*attrs.get('x2'), node.factor*attrs.get('y2'));
    ctx.stroke();
    if (fill) ctx.fill();
}
