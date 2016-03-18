import * as d3 from 'd3-selection';
import {CanvasElement} from './element';
import {pen} from './path';
import resolution from './utils';


function selection (context, factor) {
    if (!factor) factor = resolution();
    var s = d3.selection();
    s._groups[0][0] = new CanvasElement(context, factor);
    return s;
}

selection.prototype = d3.selection.prototype;


export default selection;


const originalAttr = selection.prototype.attr;


function selectAttr (name, value) {
    if (arguments.length > 1) {
        var node = this.node();
        if (node instanceof CanvasElement && pen.test(name, value))
            arguments[1] = pen(value, 1);
    }
    return originalAttr.apply(this, arguments);
}


selection.prototype.attr = selectAttr;
