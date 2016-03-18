import {selection} from 'd3-selection';
import {transition} from 'd3-transition';
import {CanvasElement} from './element';
import resolution from './utils';


export default function (context, factor) {
    if (!factor) factor = resolution();
    var s = selection();
    s._groups[0][0] = new CanvasElement(context, factor);
    return s;
}


const originalAttr = transition.prototype.attr;


export function tweenAttr (name, value) {
    var node = this.node();
    if (node instanceof CanvasElement && name === 'd')
        return transition.prototype.attrTween.call(this, name, value);
    else
        return originalAttr.call(this, name, value);
}

transition.prototype.attr = tweenAttr;
