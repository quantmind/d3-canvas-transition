var re = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;


export default function (node, stroke, fill, point) {
    var path = node.attrs.get('d'),
        ctx = node.context;
    if (path) {
        if (typeof(path) === 'function') {
            ctx.beginPath();
            path(node);
            if (stroke) ctx.stroke();
            if (fill) ctx.fill();
            if (point && ctx.isPointInPath(point.x, point.y))
                point.nodes.push(node);
        } else if (window.Path2D) {
            var Path2D = window.Path2D,
                p = new Path2D(multiply(path, node.factor));
            if (stroke) ctx.stroke(p);
            if (fill) ctx.fill(p);
            if (point && ctx.isPointInPath(p, point.x, point.y))
                point.nodes.push(node);
        }
    }
}


function multiply(path, factor) {
    if (factor === 1) return path;
    var pm, index = 0, result = '';
    path = path + '';
    while (pm = re.exec(path)) {
        result += path.substring(index, pm.index) + factor*pm[0];
        index = pm.index + pm[0].length;
    }
    return result+path.substring(index);
}
