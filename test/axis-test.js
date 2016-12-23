import {test} from 'tape';
import {scaleLinear} from 'd3-scale';
import {axisBottom} from 'd3-axis';

import {getCanvas} from './utils';
import {selectCanvas} from '../index';


test('Test axis', (t) => {

    var group = selectCanvas(getCanvas()),
        axis = axisBottom(scaleLinear()),
        axgroup = group.selectAll('g.x-axis').data([null]);

    axgroup
        .enter()
            .append('g')
            .attr('class', 'x-axis')
        .merge(axgroup)
            .call(axis);

    t.equal(group.selectAll('*').size(), 35);
    axgroup = group.select('g.x-axis');
    t.ok(axgroup.node());

    var children = axgroup.selectAll('*');
    t.ok(children.size());
    t.end();
});
