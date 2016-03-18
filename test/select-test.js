import {test} from 'tape';
import {selection} from 'd3-selection';
import {symbol} from 'd3-shape';
import {getCanvas} from './utils';
import * as d3 from '../';


test("Test module", (t) => {
    t.equal(typeof(d3.select), 'function');
    t.equal(typeof(d3.resolution), 'function');
    t.equal(typeof(d3.tweenAttr), 'function');
    t.end();
});


test("Test selection", (t) => {
    var group = d3.select(getCanvas());
    t.equal(group.size(), 1);
    t.ok(group instanceof selection);
    t.equal(group._parents.length, 1);
    t.equal(group._parents[0], null);
    t.end();
});


test("Test root node", (t) => {
    var group = d3.select(getCanvas());
    var node = group.node();
    t.equal(node.factor, 2);
    t.ok(node.context);
    t.equal(node.children().length, 0);
    t.equal(node.parentNode, undefined);
    t.end();
});


test("Test enter", (t) => {
    var group = d3.select(getCanvas()),
        paths = group.selectAll('path').data([1, 2, 3]),
        sy = symbol();

    paths.enter()
        .append('path')
        .merge(paths)
        .attr('x', function (d) {return d})
        .attr('y', function (d) {return d})
        .attr('d', sy);

    paths.exit()
        .remove();

    paths = group.selectAll('path');
    t.equal(paths.size(), 3);
    t.end();
});


test("Test remove", (t) => {
    var group = d3.select(getCanvas()),
        paths = group.selectAll('path').data([1, 2, 3]);

    paths.enter()
        .append('path')
        .attr('x', function (d) {return d})
        .attr('y', function (d) {return d});

    paths = group.selectAll('path').data([1, 2]);

    t.equal(paths.size(), 2);

    paths
        .enter()
        .append('path')
        .merge(paths)
        .attr('fill', 'blue');

    paths.exit()
        .remove();

    paths = group.selectAll('path');

    t.equal(paths.size(), 2);

    paths.each(function () {
        t.equal(this.getAttribute('fill'), 'blue');
    });

    t.end();
});
