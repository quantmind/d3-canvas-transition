import {color} from 'd3-color';


export function strokeStyle (node) {
    var ctx = node.context,
        stroke = getColor(node.attrs.get('stroke')),
        width = getSize(node.attrs.get('stroke-width')),
        lineJoin = node.attrs.get('stroke-linejoin'),
        save = false;

    if (width !== undefined) {
        save = true;
        ctx.lineWidth = node.factor * width;
    }
    if (stroke) {
        save = true;
        var opacity = node.getValue('stroke-opacity');
        if (opacity || opacity === 0)
            stroke.opacity = opacity;
        ctx.strokeStyle = '' + stroke;
    }
    if (lineJoin) {
        save = true;
        ctx.lineJoin = lineJoin;
    }
    return save;
}


export function fillStyle (node) {
    var fill = getColor(node.attrs.get('fill'));
    if (fill) {
        var opacity = node.getValue('fill-opacity');
        if (opacity || opacity===0)
            fill.opacity = opacity;
        node.context.fillStyle = ''+fill;
        return fill;
    }
}


function getColor(value) {
    if (value && value !== 'none') return color(value);
}


function getSize (value) {
    if (typeof(value) == 'string' && value.substring(value.length-2) === 'px')
        return +value.substring(0, value.length-2);
    else if (typeof(value) == 'number')
        return value;
}


export function StyleNode (node) {
    this.node = node;
}


StyleNode.prototype = {

    getPropertyValue (name) {
        var value = this.node.getValue(name);
        if (value === undefined)
            value = window.getComputedStyle(this.node.context.canvas).getPropertyValue(name);
        return value;
    }

};
