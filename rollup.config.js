import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        sourcemaps()
    ],
    extend: true,
    sourceMap: true,
    dest: 'build/d3-canvas-transition.js',
    external: [
        'd3-collection',
        'd3-color',
        'd3-selection',
        'd3-timer'
    ],
    globals: {
        'd3-collection': 'd3',
        'd3-color': 'd3',
        'd3-selection': 'd3',
        'd3-timer': 'd3'
    }
};
