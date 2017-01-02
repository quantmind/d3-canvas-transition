export default function (value, dim) {
    if (typeof(value) == 'string') {
        if (value.substring(value.length - 2) === 'px')
            return +value.substring(0, value.length - 2);
        else if (value.substring(value.length - 1) === '%')
            return 0.01 * value.substring(0, value.length - 1) * (dim || 1);
        else if (value.substring(value.length - 2) === 'em')
            return value.substring(0, value.length - 2) * (dim || 1);
    }
    else if (typeof(value) == 'number')
        return value;
}


export var sizeTags = {};


export function nodeDim (node) {
    var tag = sizeTags[node.tagName];
    return tag ? tag(node) : {x: 0, y: 0, width: node.context.canvas.width, height: node.context.canvas.height};
}
