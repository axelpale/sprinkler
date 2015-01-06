# sprinkler.js<sup>v0.4.3</sup>

With Sprinkler you can create an image rain on canvas. Give it a canvas element and a list of image paths and call start() to make it rain bananas or frogs or anything you can imagine!

Compatible with all the [browsers that support canvas](http://caniuse.com/#feat=canvas).



## Examples

- [Snowfall](http://rawgit.com/axelpale/sprinkler/master/examples/snowfall.html)
- [Money](http://rawgit.com/axelpale/sprinkler/master/examples/money.html)
- [Fire](http://rawgit.com/axelpale/sprinkler/master/examples/fire.html)
- [Bananas](http://rawgit.com/axelpale/sprinkler/master/examples/bananas.html)
- [Love](http://rawgit.com/axelpale/sprinkler/master/examples/love.html)



## Usage

The following will make the canvas rain snowflakes.

    var c = document.getElementById('canvas');
    var s = Sprinkler.create(c);

    var images = [
      'img/snowflake.png',
      'img/snowflakeb.png',
      'img/snowflakec.png'
    ];
    s.load(images, function (err, start) {
      start();
    });



## Installation

### Browsers

    <script src="scripts/sprinkler.js"></script>

### CommonJS & Node.js

    $ npm install sprinkler
    ---
    > var Sprinkler = require('sprinkler');

### AMD & Require.js

    define(['scripts/sprinkler'], function (Sprinkler) { ... });



## API

### Sprinkler.create(canvasElement)

Create a sprinkler animation on the given canvas.


### #load(imagePaths, callback(err, start))

Loads image files specified by the image source paths in `imagePaths` and then calls the `callback`. Returns nothing.

`imagePaths`, an array of image source paths.


### start(options)

Start animation. `start` is given via `load` callback.

Returns a `stop` function that stops the animation.

Optional `options` object can take following properties:

- `selectImages`, an array of indices of the images to be used
- `imagesInSecond`, an average number of dropped images in a second
- `zMin` and `zMax`, range for initial scale, __z__, in [0, Inf]
- `rMin` and `rMax`, range for initial __r__otation, in [0, 2*Math.PI]
- `aMin` and `aMax`, range for initial transparency (__a__lpha), in [0, 1]
- `dxMin` and `dxMax`, range for horizontal velocity, in [-Inf, Inf]
- `dyMin` and `dyMax`, range for vertical velocity, in [0, Inf]
- `dzMin` and `dzMax`, range for scale velocity, in [-Inf, Inf]
- `drMin` and `drMax`, range for rotation velocity, in [-Inf, Inf]
- `daMin` and `daMax`, range for transparency velocity, in [-Inf, Inf]
- `ddxMin` and `ddxMax`, range for horizontal acceleration, in [-Inf, Inf]
- `ddyMin` and `ddyMax`, range for vertical acceleration, in [0, Inf]
- `ddzMin` and `ddzMax`, range for scale acceleration, in [-Inf, Inf]
- `ddrMin` and `ddrMax`, range for rotation acceleration, in [-Inf, Inf]
- `ddaMin` and `ddaMax`, range for transparency acceleration, in [-Inf, Inf]

Values are picked randomly but uniformly from the given __ranges__.

Default values are:

    {
      selectImages: [all],
      imagesInSecond: 7,
      zMin: 0.38, zMax: 1,
      rMin: 0, rMax: 2 * Math.PI,
      aMin: 1, aMax: 1,
      dxMin: -1, dxMax: 1,
      dyMin: 100, dyMax: 100,
      dzMin: 0, dzMax: 0,
      drMin: -1, drMax: 1,
      daMin: 0, daMax: 0,
      ddxMin: 0, ddxMax: 0,
      ddyMin: 0, ddyMax: 0,
      ddzMin: 0, ddzMax: 0,
      ddrMin: 0, ddrMax: 0,
      ddaMin: 0, ddaMax: 0,
    }


### stop()

Stops the animation. `stop` is returned by `start`.



## Notes for developers

Run tests with `$ npm test`.

Build with `$ npm run build`.

Serve with `$ npm start`.



## Todo

- improved tests



## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



## License

[MIT License](../blob/master/LICENSE)
