export default function deque () {
    return new Deque;
}


function Deque () {
    this._head = null;
    this._tail = null;
    this._length = 0;

    Object.defineProperty(this, 'length',  {
        get () {
            return this._length;
        }
    });
}


Deque.prototype = deque.prototype = {

    prepend (child, refChild) {
        if (!this._length) {
            child._prev = null;
            child._next = null;
        }
        else if (refChild) {
            child._prev = refChild._prev;
            child._next = refChild;

            if (refChild._prev)
                refChild._prev._next = child;

            refChild._prev = child;
        }
        else {
            child._prev = this._tail;
            child._next = null;
            this._tail._next = child;
        }
        if (!child._prev) this._head = child;
        if (!child._next) this._tail = child;
        this._length++;
    },

    remove (child) {
        if (child._prev)
            child._prev._next = child._next;

        if (child._next)
            child._next._prev = child._prev;

        if (this._head === child)
            this._head = child._next;

        if (this._tail === child)
            this._tail = child._prev;

        delete child._prev;
        delete child._next;

        this._length--;
    },

    list () {
        var child = this._head,
            list = [];
        while (child) {
            list.push(child);
            child = child._next;
        }
        return list;
    },

    each (f) {
        var child = this._head;
        while (child) {
            f(child);
            child = child._next;
        }
    }
};
