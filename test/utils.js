import { default as Canvas } from "canvas";
import { jsdom } from "jsdom";

global.document = jsdom("<div></div>");
global.window = global.document.documentElement;
global.window.devicePixelRatio = 2;

export function identity(d) {
  return d;
}

export function getCanvas(x, y) {
  return new Canvas(x || 300, y || 300).getContext("2d");
}
