export default function (attr, factor) {

    var factor2 = factor*factor,
        orginSize = attr.size();

    function path () {
        return canvasPath(attr, arguments);
    }

    attr.size(size2);

    path.size = function (_) {
        if (arguments.length === 0) return size2;
        orginSize = _;
        return path;
    };

    return path;

    function size2 (d) {
        return factor2*orginSize(d);
    }
}


function canvasPath (attr, parameters) {

    return function () {
        attr.apply(this, parameters);
    };
}
