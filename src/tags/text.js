const
    fontProperties = ['style', 'variant', 'weight', 'size', 'family'],
    defaultBaseline = 'middle',
    textAlign = {
        start: 'start',
        middle: 'center',
        end: 'end'
    };


export default function (node) {
    var size = fontString(node);
    node.context.textAlign = textAlign[node.getValue('text-anchor')] || textAlign.middle;
    node.context.textBaseline = node.getValue('text-baseline') || defaultBaseline;
    node.context.fillText(
        node.textContent || '',
        fontLocation(node, 'x', size),
        fontLocation(node, 'y', size)
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
                size = node.factor*v;
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


function fontLocation (node, d, size) {
    var p = node.attrs.get(d) || 0,
        dp = node.attrs.get('d' + d) || 0;
    if (dp) {
        if (dp.substring(dp.length - 2) == 'em') dp = size * dp.substring(0, dp.length - 2);
        else if (dp.substring(dp.length - 2) == 'px') dp = +dp.substring(0, dp.length - 2);
    }
    return node.factor*(p + dp);
}
