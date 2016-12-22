export default function (node, stroke, fill) {
    var path = node.attrs.get('d'),
        ctx = node.context;

    if (path) {
        if (typeof(path.draw) === 'function') path.draw(node);
        else if (path.context) path.context(node.context)();
        ctx.stroke();
        if (fill) ctx.fill();
    }
}
