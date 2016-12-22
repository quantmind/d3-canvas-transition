export {default as selectCanvas} from './src/selection';
export {default as resolution} from './src/utils';
export {CanvasElement} from './src/element';
export {version as canvasVersion} from './package.json';

import {tagDraws, attributes} from './src/draw';

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

import opacity from './src/attrs/opacity';
import transform from './src/attrs/transform';
import linecap from './src/attrs/linecap';
import linejoin from './src/attrs/linejoin';

attributes.set('opacity', opacity);
attributes.set('stroke-linecap', linecap);
attributes.set('stroke-linejoin', linejoin);
attributes.set('transform', transform);
