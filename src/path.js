

class PathTransition {

    constructor (factor) {
        this.factor = factor || 1;
        this.time = 1;
    }

    update (value) {
        if (this.time === 1) {
            this.pen = value.pen;
            this.data0 = this.data1 || value.data;
            this.data1 = value.data;
            this.x = this.pen.x();
            this.y = this.pen.y();
        }
        this.time = value.time;
        this.current = value.data;
    }

    draw (node) {
        this.pen
            .context(node.context)
            .x(this.accessor(this.x))
            .y(this.accessor(this.y))(this.current);
    }

    accessor (f) {
        var factor = this.factor,
            data = this.data0,
            time = this.time;
        return function (d, i) {
            return factor*(time * f(d) + (1 - time) * f(data[i]));
        };
    }
}


export default function (node, attr, value) {
    if (attr === 'd' && value && value.pen && typeof(value.pen.x) === 'function') {
        var transition = node.attrs.get(attr);

        if (!transition) {
            transition = new PathTransition(node.factor);
            node.attrs.set(attr, transition);
        }

        transition.update(value);
    }
    else
        node.attrs.set(attr, value)
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
