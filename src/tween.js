import {transition} from 'd3-transition';
import {CanvasElement} from './element';


const originalAttr = transition.prototype.attr;


function tweenAttr (name, value) {
    var node = this.node();
    if (node instanceof CanvasElement && name === 'd') {
        if (value && typeof(value.context) === 'function')
            value = wrapPath(value);
        return transition.prototype.attrTween.call(this, name, value);
    }
    else
        return originalAttr.call(this, name, value);
}

transition.prototype.attr = tweenAttr;


export default tweenAttr;


function wrapPath (p) {
    return function (d, i) {
        return function (t) {
            return {
                pen: p,
                time: t,
                data: d,
                index: i
            }
        };
    };
}
