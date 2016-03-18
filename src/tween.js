import {transition} from 'd3-transition';
import {CanvasElement} from './element';
import {pen} from './path';


const originalAttr = transition.prototype.attr;


function tweenAttr (name, value) {
    var node = this.node();
    if (node instanceof CanvasElement && pen.test(name, value)) {
        return transition.prototype.attrTween.call(this, name, wrapPath(value));
    }
    else
        return originalAttr.call(this, name, value);
}

transition.prototype.attr = tweenAttr;


export default tweenAttr;


function wrapPath (p) {
    return function (d, i) {
        return function (t) {
            return pen(p, t, d, i);
        };
    };
}
