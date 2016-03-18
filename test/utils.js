import {jsdom} from 'jsdom';
import {default as Canvas} from 'canvas';


global.document = jsdom("<h1>Tests</h1>h1>");
global.window = {devicePixelRatio: 2};


export function identity (d) {
    return d;
}


export function getCanvas(x, y) {
    return new Canvas(x || 300, y || 300).getContext('2d');
}
