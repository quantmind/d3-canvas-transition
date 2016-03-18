import {test} from 'tape';
import * as d3 from '../';
// import {symbol} from 'd3-shape';



test("Test module", (t) => {
    t.equal(typeof(d3.select), 'function');
    t.equal(typeof(d3.resolution), 'function');
    t.equal(typeof(d3.tweenAttr), 'function')
    t.end();
});
