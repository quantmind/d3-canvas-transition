export default function (node) {
    var o = node.attrs.get('stroke-linecap');
    if (o) node.context.lineCap = o;
}
