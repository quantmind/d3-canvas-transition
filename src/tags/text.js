import getSize from '../size';

var fontProperties = ['style', 'variant', 'weight', 'size', 'family'],
    defaultBaseline = 'middle',
    textAlign = {
        start: 'start',
        middle: 'center',
        end: 'end'
    };


export default function (node) {
    var factor = node.factor,
        size = fontString(node)/factor,
        ctx = node.context;
    ctx.textAlign = textAlign[node.getValue('text-anchor')] || textAlign.middle;
    ctx.textBaseline = node.getValue('text-baseline') || defaultBaseline;
    ctx.fillText(
        node.textContent || '',
        factor*getSize(node.attrs.get('dx') || 0, size),
        factor*(getSize(node.attrs.get('dy') || 0, size) - 2)
    );
}


function fontString (node) {
    let bits = [],
        size = 0,
        key, v, family;
    for (let i=0; i<fontProperties.length; ++i) {
        key = fontProperties[i];
        v = node.getValue('font-' + key);
        if (v) {
            if (key === 'size') {
                size = node.factor*getSize(v);
                v = size + 'px';
            } else if (key === 'family') {
                family = v;
            }
            bits.push(v);
        }
    }
    //
    if (size) {
        if (!family) bits.push('sans serif');
        node.context.font = bits.join(' ');
    }
    return size;
}
