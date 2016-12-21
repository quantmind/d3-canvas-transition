export default function (node, attr, value) {
    var current = node.attrs.get(attr);
    if (current === value) return false;
    node.attrs.set(attr, value);
    return true;
}
