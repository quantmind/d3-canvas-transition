import {redraw} from './draw';


export const mouseEvents = {
    mouseenter: 'mousemove',
    mouseleave: 'mousemove'
};


export default function (event) {
    var context = this.getContext('2d'),
        root = context._rootElement;
    if (!root) return;

    event.canvasPoint = {
        x: root.factor*event.offsetX,
        y: root.factor*event.offsetY
    };

    var nodes = redraw(root, event.canvasPoint)(),
        handler = event.type === 'mousemove' ? mousemoveEvent : defaultEvent;

    handler(context, nodes, event);
}


function defaultEvent (context, nodes, event) {
    for (var i=nodes.length-1; i>=0; --i) {
        if (trigger(nodes[i], event)) break;
    }
}


function mousemoveEvent (context, nodes, event) {
    var actives = context._activeNodes,
        newActives = [],
        active = nodes.length ? nodes[nodes.length-1] : null,
        node, i;

    // Handle mouseleave
    if (actives) {
        for (i = 0; i < actives.length; ++i) {
            node = actives[i];
            if (active && node !== active && node.parentNode === active.parentNode)
                trigger(node, event, 'mouseleave');
            else if (nodes.indexOf(node) > -1)
                newActives.push(node);
            else
                trigger(node, event, 'mouseleave');
        }
    }

    context._activeNodes = actives = newActives;

    for (i=0; i<nodes.length; ++i) {
        node = nodes[i];
        if (actives.indexOf(node) > -1)
            trigger(node, event, 'mouseover');
        else if (node === active || node.parentNode !== active.parentNode) {
            actives.push(node);
            trigger(node, event, 'mouseenter');
        }
    }
}


function trigger (node, event, type) {
    var listeners = node.events[type || event.type];
    if (listeners) {
        for (var j = 0; j < listeners.length; ++j)
            listeners[j].call(node, event);
        return node;
    }
}
