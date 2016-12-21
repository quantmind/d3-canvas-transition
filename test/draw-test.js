import {test} from 'tape';
import {symbol} from 'd3-shape';
import {timeout} from 'd3-timer';

import {selectCanvas} from '../index';
import {getCanvas} from './utils';


test('Test path', (t) => {
    var group = selectCanvas(getCanvas()),
        node = group.node(),
        paths = group.selectAll('path').data([1, 2, 3]),
        sy = symbol().size((d) => d*2);

    paths
        .enter()
            .append('path')
        .merge(paths)
            .attr('transform', function (d) {
                return `translate(${d}, ${d})`;
            })
            .attr('d', sy);

    paths = group.selectAll('path');
    t.equal(paths.size(), 3);

    t.equal(node.childNodes.length, 3);
    t.ok(node._scheduled);

    timeout(() => {
        t.equal(node.childNodes.length, 3);
        t.notOk(node._scheduled);
        t.end();
    });
});
