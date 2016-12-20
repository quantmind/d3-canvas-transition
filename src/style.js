import {color} from 'd3-color';


export function strokeStyle (node) {
    var stroke = getColor(node.attrs.get('stroke'));
    if (stroke) {
        var opacity = node.getValue('stroke-opacity');
        if (opacity || opacity === 0)
            stroke.opacity = opacity;
        node.context.strokeStyle = '' + stroke;
        node.context.lineWidth = node.factor * (node.getValue('stroke-width') || 1);
        node.context.stroke();
        return stroke;
    }
}


export function fillStyle (node) {
    var fill = getColor(node.attrs.get('fill'));
    if (fill) {
        var opacity = node.getValue('fill-opacity');
        if (opacity || opacity===0)
            fill.opacity = opacity;
        node.context.fillStyle = ''+fill;
        node.context.fill();
        return fill;
    }
}


function getColor(value) {
    if (value && value !== 'none') return color(value);
}
