export default function (node, stroke, fill, point) {
    var path = node.attrs.get('d'),
        ctx = node.context;

    if (path) {
        var p;

        if (typeof(path) === 'function') {
            ctx.beginPath();
            path(node);
            ctx.stroke();
            if (point && ctx.isPointInPath(point.x, point.y))
                point.nodes.push(node);
        } else if (window.Path2D) {
            var Path2D = window.Path2D;
            p = new Path2D(path);
            ctx.stroke(p);
            if (point && ctx.isPointInPath(p, point.x, point.y))
                point.nodes.push(node);
        } else
            return;

        if (fill) ctx.fill();
    }
}
