<a name="1.0.0-rc.3"></a>
# 1.0.0-rc.2-1 (2019-10-19)

### Breaking changes

* indexing of the style of `line bar` chart has been moved from index `0` to begin with `1`
* property `range` replaced by CSS4 variables generated dynamically 

### Features

* add a new CSS4 variable `--deckgo-chart-stroke` in case you would like to use a default styling color for all the graphs' lines
* update most recent libs

<a name="1.0.0-rc.2"></a>
# 1.0.0-rc.2 (2019-10-09)

### Features

* when using animation bar, allow custom labels for x-axis ([#340](https://github.com/deckgo/deckdeckgo/issues/340))

<a name="1.0.0-rc.1"></a>
# 1.0.0-rc.1 (2019-08-30)

### Libs

* update to most recent dependencies

### Note about v1.0.0-rc.1

The first users began to test, and to create content in, our web open source editor for presentations (`studio`) 

<a name="1.0.0-alpha.8"></a>
# 1.0.0-alpha.8 (2019-06-24)

### Features

* animated charts: it is now possible to display several data in the same graphs. these could be displayed one after the others with a nice transition between these

### Breaking

* the styling (fill color, etc.) of the `line` and `bar` chart has been modified
* per default, the labels of the axis of the  `line` and `bar` will be displayed

Referer to the updated [documentation](https://docs.deckdeckgo.com) for more information.

<a name="1.0.0-alpha.7"></a>
# 1.0.0-alpha.7 (2019-06-04)

### Libs

* upgrade to Stencil One

<a name="1.0.0-alpha.6"></a>
# 1.0.0-alpha.6 (2019-05-24)

### Breaking

* move to the org scoped package `@deckdeckgo/charts`

<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5](https://github.com/fluster/deckdeckgo-charts/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2019-02-07)

### Features

* feat: redraw chart if width, height or src change ([01aa026](https://github.com/deckgo/deckdeckgo-charts/commit/01aa026f0ab746684abf1e9e83b975ea15eaaef1))
* feat: add text variable to bar and line charts ([54cbbb2](https://github.com/deckgo/deckdeckgo-charts/commit/54cbbb2a11a4873e9462b48dd41d0fb6985d5ef5))

<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4](https://github.com/fluster/deckdeckgo-charts/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2019-02-02)

### Lib

* update Stencil and d3js ([530c090](https://github.com/deckgo/deckdeckgo-charts/commit/530c090eb85862576758c31886c9d38d1c2c98df))
