import {test} from 'tape';
import {selection} from 'd3-selection';
import {symbol} from 'd3-shape';
import {getCanvas} from './utils';
import * as d3 from '../index';


test('Test module', (t) => {
    t.equal(typeof(d3.canvasVersion), 'string');
    t.equal(typeof(d3.selection), 'function');
    t.equal(typeof(d3.select), 'function');
    t.equal(typeof(d3.selectAll), 'function');
    t.equal(typeof(d3.resolution), 'function');
    t.equal(typeof(d3.tweenAttr), 'function');
    t.equal(typeof(d3.fontProperties), 'object');
    t.end();
});


test('Test resolution', (t) => {
    t.equal(d3.resolution(), 2);
    t.equal(d3.resolution(3), 3);
    t.equal(d3.resolution(0), 2);
    t.equal(d3.resolution(null), 2);
    t.end();
});


test('Test selection', (t) => {
    var group = d3.selection(getCanvas());
    t.ok(group instanceof selection);
    t.equal(group.size(), 1);
    t.ok(group instanceof selection);
    t.equal(group._parents.length, 1);
    t.equal(group._parents[0], null);
    t.end();
});


test('Test root node', (t) => {
    var group = d3.selection(getCanvas());
    var node = group.node();
    t.equal(node.factor, 2);
    t.ok(node.context);
    t.equal(node.childNodes.length, 0);
    t.equal(node.parentNode, undefined);
    t.end();
});


test('Test enter', (t) => {
    var group = d3.selection(getCanvas()),
        paths = group.selectAll('path').data([1, 2, 3]),
        sy = symbol();

    paths.enter()
            .append('path')
        .merge(paths)
            .attr('x', function (d) {return d;})
            .attr('y', function (d) {return d;})
            .attr('d', sy);

    paths = group.selectAll('path');
    t.equal(paths.size(), 3);
    t.end();
});


test('Test remove', (t) => {
    var group = d3.selection(getCanvas()),
        paths = group.selectAll('path').data([1, 2, 3]);

    paths.enter()
        .append('path')
        .attr('x', function (d) {return d;})
        .attr('y', function (d) {return d;});

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


test('Test select by id', (t) => {
    var group = d3.selection(getCanvas());
    group.append('g').attr('id', 'fooo');
    group.append('g').attr('id', 'bla');

    t.equal(group.selectAll('*').size(), 2);

    var g = group.selectAll('#bla');
    t.equal(g.size(), 1);
    t.equal(g.node().tagName, 'g');
    t.equal(g.node().id, 'bla');

    t.end();
});
