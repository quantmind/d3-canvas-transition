export default function (node) {
    var o = node.attrs.get('stroke-linejoin');
    if (o) node.context.lineJoin = o;
}
