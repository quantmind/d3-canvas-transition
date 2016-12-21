export default function (node) {
    var x = +(node.attrs.get('x') || 0),
        y = +(node.attrs.get('y') || 0),
        trans = node.attrs.get('transform'),
        ctx = node.context;

    if (trans) {
        var index1 = trans.indexOf('translate('),
            index2, s, bits;
        if (index1 > -1) {
            s = trans.substring(index1 + 10);
            index2 = s.indexOf(')');
            bits = s.substring(0, index2).split(',');
            x += +bits[0];
            if (bits.length === 2) y += +bits[1];
        }

        index1 = trans.indexOf('rotate(');
        if (index1 > -1) {
            s = trans.substring(index1 + 7);
            var angle = +s.substring(0, s.indexOf(')'));
            if (angle === angle) {
                ctx.save();
                ctx.rotate(angle*Math.PI/180);
            }
        }
    }
    if (x || y) {
        ctx.save();
        ctx.translate(node.factor * x, node.factor * y);
    }
}
