export default function (node) {
    var o = node.attrs.get('opacity');
    if (o !== undefined) node.context.globalAlpha = +o;
}
