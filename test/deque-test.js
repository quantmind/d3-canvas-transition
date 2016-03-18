import {test} from 'tape';
import {getCanvas} from './utils';
import * as d3 from '../';


test("Test empty element", (t) => {
    var node = new d3.CanvasElement(getCanvas());
    t.notOk(node.hasChildNodes());
    t.notOk(node.previousSibling);
    t.notOk(node.nextSibling);
    t.notOk(node.firstChild);
    t.notOk(node.lastChild);
    t.deepEqual(node.childNodes, []);
    t.end();
});


test("Test append element", (t) => {
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


test("Test prepend element", (t) => {
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
