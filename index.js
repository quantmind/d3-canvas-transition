export {default as tweenAttr} from './src/tween';
export {default as selection} from './src/selection';
export {default as resolution} from './src/utils';
export {CanvasElement} from './src/element';
export {axisTop, axisRight, axisBottom, axisLeft} from './src/axis';
export {version as canvasVersion} from './package.json';

export {creator, matcher, mouse, namespace, namespaces,
        select, selectAll, selector, selectorAll, touch,
        touches, window, event} from 'd3-selection';

import {tagDraws} from './src/element';
import line from './src/tags/line';
import path from './src/tags/path';
import text from './src/tags/text';

tagDraws.set('line', line);
tagDraws.set('line', path);
tagDraws.set('text', text);
