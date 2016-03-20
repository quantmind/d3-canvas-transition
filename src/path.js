// import {active} from 'd3-transition';


class PathTransition {

    constructor (factor) {
        this.factor = factor || 1;
        this.time = Infinity;
        this.data1 = [];
    }

    update (value) {
        if (value.time < this.time) {
            var data1 = this.data1;
            while (data1.length < value.data.length) data1.push(new Array(2));
            this.data0 = this.data1;
            this.x = value.pen.x();
            this.y = value.pen.y();
        }
        this.pen = value.pen;
        this.time = value.time;
        this.current = value.data;
    }

    draw (node) {
        node.context.beginPath();
        this.pen
            .context(node.context)
            .x(this.accessor(this.x, 0))
            .y(this.accessor(this.y, 1))(this.current);
    }

    accessor (f, j) {
        var factor = this.factor,
            data0 = this.data0,
            data1 = this.data1,
            time = this.time,
            prev, curr;
        return function (d, i) {
            prev = data0[i][j];
            if (prev === undefined) curr = factor*f(d);
            else curr = factor*(time * f(d) + (1 - time) * prev);
            data1[i][j] = curr;
            return curr;
        };
    }
}


export default function (node, attr, value) {
    var current = node.attrs.get(attr);
    if (current === value) return false;
    if (attr === 'd' && value && value.pen && typeof(value.pen.x) === 'function') {

        if (!current) {
            current = new PathTransition(node.factor);
            node.attrs.set(attr, current);
        }

        current.update(value);
        return true;
    }
    else {
        node.attrs.set(attr, value);
        return true;
    }
}


export function pen (p, t, d, i) {
    return {
        pen: p,
        time: t,
        data: d,
        index: i || 0
    }
}


pen.test = function (name, value) {
    return name === 'd' && value && typeof(value.context) === 'function';
};
