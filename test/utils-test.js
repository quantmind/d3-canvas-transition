import {test} from 'tape';
import {select} from 'd3-selection';
import {getSize} from '../index';


test('Test getSize', (t) => {
    t.equal(getSize(), undefined);
    var d = select(document.createElement('div')).style('width', '960px');
    t.equal(getSize(d.style('width')), 960);
    t.equal(getSize(10), 10);
    t.equal(getSize('10%', 1000), 100);
    t.equal(getSize('10%'), 0.1);
    t.equal(getSize('0.7em'), 0.7);
    t.equal(getSize('0.7em', 10), 7);
    t.end();
});
