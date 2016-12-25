import {test} from 'tape';
import {select} from 'd3-selection';
import {getSize} from '../index';


test('Test getSize', (t) => {
    t.equal(getSize(), undefined);
    var d = select(document.createElement('div')).style('width', '960px');
    t.equal(getSize(d.style('width')), 960);
    t.end();
});
