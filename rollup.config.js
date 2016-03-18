import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3_canvas_transition',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    dest: 'build/d3-canvas-transition.js',
    globals: {
        'd3-collection': 'd3_collection',
        'd3-color': 'd3_color',
        'd3-interpolate': 'd3_interpolate',
        'd3-selection': 'd3_selection',
        'd3-transition': 'd3_transition'
    }
};
