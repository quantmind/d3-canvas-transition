# d3-canvas-transition

[![CircleCI](https://circleci.com/gh/quantmind/d3-canvas-transition.svg?style=svg)](https://circleci.com/gh/quantmind/d3-canvas-transition)
[![Dependency Status](https://david-dm.org/quantmind/d3-canvas-transition.svg)](https://david-dm.org/quantmind/d3-canvas-transition)
[![devDependency Status](https://david-dm.org/quantmind/d3-canvas-transition/dev-status.svg)](https://david-dm.org/quantmind/d3-canvas-transition#info=devDependencies)

**ALPHA - USE IT WITH CARE**

This is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for drawing on
svg and canvas using the same [d3-transition](https://github.com/d3/d3-transition) API.

## Installing

If you use [NPM](https://www.npmjs.com/package/d3-canvas-transition), ``npm install d3-canvas-transition``.
Otherwise, download the [latest release](https://github.com/quantmind/d3-canvas-transition/releases).
You can also load directly from [giottojs.org](https://giottojs.org),
as a [standalone library](https://giottojs.org/latest/d3-canvas-transition.js) or
[unpkg](https://unpkg.com/d3-canvas-transition/).
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported.
Try [d3-canvas-transition](https://runkit.com/npm/d3-canvas-transition) in your browser.
```javascript
<script src="https://d3js.org/d3-collection.v1.min.js"></script>
<script src="https://d3js.org/d3-color.v1.min.js"></script>
<script src="https://d3js.org/d3-selection.v1.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://giottojs.org/latest/d3-canvas-transition.min.js"></script>
<body>
<canvas id="hi" width="400" height="400"></canvas>
<script>
var canvas = d3.select('#hi').canvas();
</script>
```
For examples check [lsbardel blocks](http://bl.ocks.org/lsbardel)
