var conv = Math.PI/180;


export default function (node) {
    var x = +(node.attrs.get('x') || 0),
        y = +(node.attrs.get('y') || 0),
        trans = node.attrs.get('transform'),
        ctx = node.context,
        sx, sy, angle;

    if (typeof(trans) === 'string') {
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
            angle = +s.substring(0, s.indexOf(')'));
        }

        index1 = trans.indexOf('scale(');
        if (index1 > -1) {
            s = trans.substring(index1 + 6);
            index2 = s.indexOf(')');
            bits = s.substring(0, index2).split(',');
            sx = +bits[0];
            if (bits.length === 2) sy = +bits[1];
        }

    } else if (trans) {
        x += trans.x;
        y += trans.y;
        sx = trans.k;
    }
    if (sx) {
        sy = sy || sx;
        ctx.scale(sx, sy);
    }
    if (x || y) ctx.translate(ctx._factor * x, ctx._factor * y);
    if(angle && angle === angle) ctx.rotate(conv*angle);
}
