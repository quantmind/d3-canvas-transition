export {default as selectCanvas} from './src/selection';
export {default as resolution} from './src/resolution';
export {default as getSize} from './src/size';
export {default as canvasPolygon} from './src/polygon';
export {version as canvasVersion} from './package.json';

import {tagDraws} from './src/draw';

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

tagDraws.set('linearGradient', false);
tagDraws.set('radialGradient', false);
