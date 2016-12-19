export default function (node) {
    var path = node.attrs.get('d');
    if (path) {
        if (typeof(path.draw) === 'function') path.draw(node);
        else if (path.context) path.context(node.context)();
    }
}
