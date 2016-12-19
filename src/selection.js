import {selection} from 'd3-selection';

import {CanvasElement} from './element';
import {pen} from './path';
import resolution from './utils';


export default function canvasSelection (context, factor) {
    var s = selection();
    if (arguments.length) {
        if (!factor) factor = resolution();
        s._groups[0][0] = new CanvasElement(context, factor);
    }
    return s;
}

canvasSelection.prototype = selection.prototype;


const originalAttr = canvasSelection.prototype.attr;


function selectAttr (name, value) {
    if (arguments.length > 1) {
        var ref = this._parents[0] || this.node();
        if (ref instanceof CanvasElement && pen.test(name, value))
            arguments[1] = pen(value, 1);
    }
    return originalAttr.apply(this, arguments);
}


canvasSelection.prototype.attr = selectAttr;
