export default function (node) {
    var o = node.attrs.get('opacity');
    if (o !== undefined) node.context.globalAlpha = +o;
    o = node.attrs.get('shape-rendering');
    if (o === 'crispEdges') node.context.imageSmoothingEnabled = false;
}
