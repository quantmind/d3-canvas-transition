import { axisBottom } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { test } from "tape";
import { selectCanvas } from "../index";
import { getCanvas } from "./utils";

test("Test axis", (t) => {
  var group = selectCanvas(getCanvas()),
    axis = axisBottom(scaleLinear()),
    axgroup = group.selectAll("g.x-axis").data([null]);

  axgroup.enter().append("g").attr("class", "x-axis").merge(axgroup).call(axis);

  t.equal(group.selectAll("*").size(), 35);
  axgroup = group.select("g.x-axis");
  t.ok(axgroup.node());

  var children = axgroup.selectAll("*");
  t.ok(children.size());
  t.end();
});
