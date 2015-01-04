# sprinkler.js<sup>v0.3.0</sup>

With Sprinkler you can make awesome image rain effects on canvas. Give it a canvas element and a list of image paths and call start() to make it rain bananas or frogs or anything you can imagine!

Compatible with all the [browsers that support canvas](http://caniuse.com/#feat=canvas).



## Examples

- [Snowfall](http://rawgit.com/axelpale/sprinkler/master/examples/snowfall.html)
- [Money](http://rawgit.com/axelpale/sprinkler/master/examples/money.html)
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

- selectImages, an array of indices of the images to be used
- imagesInSecond, an average number of dropped images in a second

### stop()

Stops the animation. `stop` is returned by `start`.



## Notes for developers

Run tests with `$ npm test`.

Build with `$ npm run build`.

Serve with `$ npm start`.



## Todo

- implementation.
- tests



## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



## License

[MIT License](../blob/master/LICENSE)
