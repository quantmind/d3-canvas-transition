import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';


export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3',
    moduleId: 'd3-canvas-transition',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    dest: 'build/d3-canvas-transition.js',
    globals: {
        'd3-collection': 'd3',
        'd3-color': 'd3',
        'd3-selection': 'd3',
        'd3-timer': 'd3'
    }
};
