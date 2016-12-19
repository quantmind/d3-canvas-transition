import {test} from 'tape';
import {scaleLinear} from 'd3-scale';
import {getCanvas} from './utils';

import * as d3 from '../index';



test('Test axis', (t) => {

    var context = getCanvas(),
        group = d3.selection(context),
        axis = d3.axisBottom(scaleLinear()),
        axgroup = group.selectAll('g.x-axis').data([null]);

    axgroup
        .enter()
            .append('g')
            .attr('class', 'x-axis')
        .merge(axgroup)
            .call(axis);

    t.equal(group.selectAll('*').size(), 1);
    axgroup = group.select('g.x-axis');
    t.ok(axgroup.node());

    var children = axgroup.selectAll('*');
    t.ok(children.size());
    t.end();
});
