import {test} from 'tape';
import {getCanvas} from './utils';
import * as d3 from '../';


test('Test empty element', (t) => {
    var node = new d3.CanvasElement(getCanvas());
    t.notOk(node.hasChildNodes());
    t.notOk(node.previousSibling);
    t.notOk(node.nextSibling);
    t.notOk(node.firstChild);
    t.notOk(node.lastChild);
    t.deepEqual(node.childNodes, []);
    t.end();
});


test('Test append element', (t) => {
    var node = new d3.CanvasElement(getCanvas()),
        child = node.createElementNS(null, 'p');
    node.appendChild(child);
    t.ok(node.hasChildNodes());
    t.equal(node.firstChild, child, 'first child');
    t.equal(node.lastChild, child, 'last child');
    t.deepEqual(node.childNodes, [child]);

    t.equal(node.previousSibling, undefined, 'no previous');
    t.equal(node.nextSibling, undefined, 'no next');

    node.appendChild(child);
    t.equal(node.countNodes, 1, 'one child after recursive append');
    t.equal(child.parentNode, node);
    t.notOk(child.previousSibling, 'no previous');
    t.notOk(child.nextSibling, 'no next');
    t.end();
});


test('Test prepend element', (t) => {
    var node = new d3.CanvasElement(getCanvas()),
        child = node.createElementNS(null, 'p');
    node.insertBefore(child);
    t.ok(node.hasChildNodes());
    t.equal(node.firstChild, child, 'first child');
    t.equal(node.lastChild, child, 'last child');
    t.deepEqual(node.childNodes, [child]);

    t.equal(node.previousSibling, undefined, 'no previous');
    t.equal(node.nextSibling, undefined, 'no next');

    node.insertBefore(child);
    t.ok(node.hasChildNodes());
    t.equal(child.parentNode, node);
    t.notOk(child.previousSibling, 'no previous');
    t.notOk(child.nextSibling, 'no next');

    var n = node.createElementNS(null, 'text');
    node.insertBefore(n, child);

    t.equal(node.countNodes, 2, 'two nodes');
    t.equal(node.firstChild, n);
    t.equal(node.lastChild, child);
    t.equal(node.firstChild.nextSibling, child);
    t.notOk(node.lastChild.nextSibling);
    t.deepEqual(node.childNodes, [n, child]);
    t.end();
});


test('Test many elements', (t) => {
    var canvas = new d3.selection(getCanvas()),
        node = canvas.node(),
        text = canvas.selectAll('text.test').data(['a', 'b', 'c', 'd', 'f', 'g']);

    text.enter()
        .append('text')
            .attr('class', 'test')
        .merge(text)
            .text(function (d) {return d;});

    t.equal(node.countNodes, 6);
    var children = node.childNodes;
    t.equal(children.length, 6);
    // first child
    t.equal(children[0].parentNode, node);
    t.equal(children[0].previousSibling, null);
    t.equal(children[0].nextSibling, children[1]);
    t.equal(children[0].textContent, 'a');
    t.equal(node.firstChild, children[0]);
    // last child
    t.equal(children[5].parentNode, node);
    t.equal(children[5].previousSibling, children[4]);
    t.equal(children[5].nextSibling, null);
    t.equal(children[5].textContent, 'g');
    t.equal(node.lastChild, children[5]);
    //
    children.forEach((child) => {
        t.ok(node.contains(child));
    });
    //
    node.appendChild(children[0]);
    children = node.childNodes;
    t.equal(node.countNodes, 6);
    // first child
    t.equal(children[0].parentNode, node);
    t.equal(children[0].previousSibling, null);
    t.equal(children[0].nextSibling, children[1]);
    t.equal(children[0].textContent, 'b');
    t.equal(node.firstChild, children[0]);
    // last child
    t.equal(children[5].parentNode, node);
    t.equal(children[5].previousSibling, children[4]);
    t.equal(children[5].nextSibling, null);
    t.equal(children[5].textContent, 'a');
    t.equal(node.lastChild, children[5]);
    //
    var child = node.removeChild(children[0]);
    t.notOk(child.parentNode);
    t.notOk(child.previousSibling);
    t.notOk(child.nextSibling);
    t.equal(node.countNodes, 5);
    children = node.childNodes;
    // first child
    t.equal(children[0].parentNode, node);
    t.equal(children[0].previousSibling, null);
    t.equal(children[0].nextSibling, children[1]);
    t.equal(children[0].textContent, 'c');
    t.equal(node.firstChild, children[0]);

    //
    let children2 = [];
    node.each((child) => {
        children2.push(child);
    });
    t.deepEqual(children2, children);
    t.end();
});
