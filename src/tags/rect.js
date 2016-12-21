export default function (node) {
    var attrs = node.attrs;
    node.context.rect(0, 0, node.factor*(attrs.get('width') || 0), node.factor*(attrs.get('height') || 0));
}
