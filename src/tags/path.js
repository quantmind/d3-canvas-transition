export default function (node, stroke, fill, point) {
    var path = node.attrs.get('d'),
        ctx = node.context;

    if (path) {
        var p;

        if (typeof(path) === 'function') {
            ctx.beginPath();
            path(node);
            if (stroke) ctx.stroke();
            if (fill) ctx.fill();
            if (point && ctx.isPointInPath(point.x, point.y))
                point.nodes.push(node);
        } else if (window.Path2D) {
            var Path2D = window.Path2D;
            p = new Path2D(path);
            if (stroke) ctx.stroke(p);
            if (fill) ctx.fill(p);
            if (point && ctx.isPointInPath(p, point.x, point.y))
                point.nodes.push(node);
        }
    }
}
