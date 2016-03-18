import {test} from 'tape';
import {line} from 'd3-shape';
import {getCanvas, identity} from './utils';

import * as d3 from '../';


test("Test transition", (t) => {
    var group = d3.select(getCanvas()),
        paths = group.selectAll('path.line').data([[1, 2, 3]]),
        pen = line().x(identity).y(identity);

    paths = paths
        .enter()
            .append('path')
            .attr('class', 'line')
            .attr('stroke', '#ccc')
            .attr('stroke-opacity', 0)
        .merge(paths)
            .attr('d', pen)
            .attr('x', function (d) {return d})
            .attr('y', function (d) {return d});

    t.equal(paths.size(), 1);
    var c = paths.style('stroke');
    t.equal(c, '#ccc');
    t.end();
});
