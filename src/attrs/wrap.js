export default function (attr, factor) {

    var orginSize = attr.size(),
        factor2 = factor*factor,
        parameters;

    attr.size(size2);

    function attrWrap () {
        parameters = arguments;
        return attrWrap;
    }

    attrWrap.size = function (_) {
        if (arguments.length === 0) return size2;
        orginSize = _;
        return attrWrap;
    };

    attrWrap.draw = function () {
        attr.apply(this, parameters);
        return attrWrap;
    };

    return attrWrap;

    function size2 (d) {
        return factor2*orginSize(d);
    }
}
