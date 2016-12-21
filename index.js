export {default as selectCanvas} from './src/selection';
export {default as resolution} from './src/utils';
export {CanvasElement} from './src/element';
export {axisTop, axisRight, axisBottom, axisLeft} from './src/axis';
export {version as canvasVersion} from './package.json';

import {tagDraws, attributes} from './src/element';

import circle from './src/tags/circle';
import line from './src/tags/line';
import path from './src/tags/path';
import rect from './src/tags/rect';
import text from './src/tags/text';

tagDraws.set('circle', circle);
tagDraws.set('line', line);
tagDraws.set('path', path);
tagDraws.set('rect', rect);
tagDraws.set('text', text);

import transform from './src/attrs/transform';

attributes.set('transform', transform);
