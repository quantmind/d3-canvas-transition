export function NodeIterator (node) {
    this.node = node;
    this.context = node.context;
    this.current = node;
}

NodeIterator.prototype = {

    next () {
        var current = this.current;
        if (!current) return null;
        if (current.firstChild)
            current = current.firstChild;
        else {
            while (current) {
                if (current.nextSibling) {
                    current = current.nextSibling;
                    break;
                }
                current = current.parentNode;
                if (current === this.node) current = null;
            }
        }
        this.current = current;
        return current;
    }
};
