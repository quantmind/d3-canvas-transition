import { symbol } from "d3-shape";
import { timeout } from "d3-timer";
import { test } from "tape";
import { selectCanvas } from "../index";
import { getCanvas } from "./utils";

test("Test text", (t) => {
  var group = selectCanvas(getCanvas()),
    node = group.node(),
    text = group.append("text"),
    touches = node._touches;

  t.equal(text.text(), "");
  t.equal(node._touches, touches);
  t.equal(text.text("ciao").text(), "ciao");
  t.equal(node._touches, touches + 1);
  t.end();
});

test("Test path", (t) => {
  var group = selectCanvas(getCanvas()),
    node = group.node(),
    paths = group.selectAll("path").data([1, 2, 3]),
    sy = symbol().size((d) => d * 2);

  paths
    .enter()
    .append("path")
    .merge(paths)
    .attr("transform", function (d) {
      return `translate(${d}, ${d})`;
    })
    .attr("d", sy);

  paths = group.selectAll("path");
  t.equal(paths.size(), 3);

  t.equal(node.childNodes.length, 3);
  t.ok(node._scheduled);

  timeout(() => {
    t.equal(node.childNodes.length, 3);
    t.notOk(node._scheduled);
    t.end();
  });
});
