export default function (p) {

    function cp () {
        return canvasPath(p, arguments);
    }

    return cp;
}


function canvasPath (p, parameters) {

    return function () {
        p.apply(this, parameters);
    };
}
