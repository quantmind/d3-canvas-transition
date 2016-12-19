export default function (node) {
    var attrs = node.attrs;
    node.context.moveTo(node.factor*(attrs.get('x1') || 0), node.factor*(attrs.get('y1') || 0));
    node.context.lineTo(node.factor*attrs.get('x2'), node.factor*attrs.get('y2'));
}
