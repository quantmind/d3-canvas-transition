export default function (node, stroke, fill) {
    var attrs = node.attrs,
        ctx = node.context;
    ctx.rect(0, 0, node.factor*(attrs.get('width') || 0), node.factor*(attrs.get('height') || 0));
    if (stroke) ctx.stroke();
    if (fill) ctx.fill();
}
