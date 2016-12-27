export default function (node, stroke, fill) {
    var path = node.attrs.get('d'),
        ctx = node.context;

    if (path) {
        if (typeof(path) === 'function') {
            ctx.beginPath();
            path(node);
            ctx.stroke();
            if (fill) ctx.fill();
        } else if (window.Path2D) {
            var Path2D = window.Path2D,
                p = new Path2D(path);
            ctx.stroke(p);
            if (fill) ctx.fill();
        }
    }
}
