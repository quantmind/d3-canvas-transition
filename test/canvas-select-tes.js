import {test} from 'tape';
import * as d3 from '../';
import {symbol} from 'd3-shape';



test("Test module", (t) => {
    var paper = d3.giotto().new(),
        context = paper.drawings.context,
        selection = d3.canvasSelect(context);
    t.ok(selection);
    t.ok(selection.node());
    t.ok(selection.node().context, context);
    t.end();
});



test("Test enter", (t) => {
    var paper = d3.giotto().new(),
        context = paper.drawings.context,
        selection = d3.canvasSelect(context),
        sy = symbol().context(context);
    var paths = selection.selectAll('path').data([1, 2, 3]);

    paths.enter()
        .append('path')
        .merge(paths)
        .attr('x', function (d) {return d})
        .attr('y', function (d) {return d})
        .attr('d', sy);

    paths.exit()
        .remove();

    paths = selection.selectAll('path');
    t.equal(paths.size(), 3);
    t.end();
});


test("Test remove", (t) => {
    var paper = d3.giotto().new(),
        context = paper.drawings.context,
        selection = d3.canvasSelect(context);
    var paths = selection.selectAll('path').data([1, 2, 3]);

    paths.enter()
        .append('path')
        .attr('x', function (d) {return d})
        .attr('y', function (d) {return d});

    paths = selection.selectAll('path').data([1, 2]);

    t.equal(paths.size(), 2);

    paths
        .enter()
        .append('path')
        .merge(paths)
        .attr('fill', 'blue');

    paths.exit()
        .remove();

    paths = selection.selectAll('path');

    t.equal(paths.size(), 2);

    paths.each(function () {
        t.equal(this.attrs.get('fill'), 'blue');
    });

    t.end();
});


test("Test transition", (t) => {
    var paper = d3.giotto().new(),
        context = paper.drawings.context,
        selection = d3.canvasSelect(context);
    var paths = selection.selectAll('path').data([1, 2, 3]);

    paths = paths
        .enter()
        .append('path')
        .attr('x', function (d) {return d})
        .attr('y', function (d) {return d});

    paths
        .style('color', 'green');

    t.equal(paths.size(), 3);
    var c = paths.style('color');
    t.equal(c, 'green');
    t.end();
});
