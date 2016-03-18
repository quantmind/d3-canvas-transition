

class PathTransition {

    constructor (attr) {
        this.time = 1;
        this.attr = attr;
        this.$value0 = {};
        this.$value1 = {};
        this.interpolator = null;
    }

    update (node, attr, value) {
        //if (logger.debugEnabled()) logger.debug('Updating ' + this.attr + ' @ t = ' + this.time + ' for ' + attr);
        if (this.time !== 1) return false;
        this.$value0[attr] = this.$value1[attr] || value;
        this.$value1[attr] = value;
        this.$value0.x = value.x();
        this.$value0.y = value.y();
        this.$value0.data = node.__data__;
        return true;
    }

    draw (node, t) {
        this.time = t;
        var value0 = this.$value0,
            pen = this.$value1.d;

        return pen
            .context(node.context)
            .x(this.accessor(value0.x))
            .y(this.accessor(value0.y))(node.__data__);
    }

    accessor (f) {
        var data = this.$value0.data,
            time = this.time;
        return function (d, i) {
            return time * f(d) + (1 - time) * f(data[i]);
        };
    }
}


export default function (node, attr, value) {
    if (attr === 'd' && value && typeof(value.x) === 'function') {
        var transition = node.attrs.get(attr);

        if (!transition) {
            transition = new PathTransition(attr);
            node.attrs.set(attr, transition);
        }

        transition.update(node, attr, value);
    }
    else
        node.attrs.set(attr, value)
}
