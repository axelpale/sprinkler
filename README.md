# sprinkler.js<sup>v0.1.0</sup>

With Sprinkler you can make awesome sprite rain effects on canvas. Give it a canvas element and a list of image paths and call start() to make it rain bananas or frogs or anything you can imagine!



## Examples

- [Snowfall](examples/snowfall.html)



## Usage

The following will make the canvas rain snowflakes.

    var c = document.getElementById('canvas');
    var s = Sprinkler.create(c);

    var images = [
      'img/snowflake.png',
      'img/snowflakeb.png',
      'img/snowflakec.png'
    ];
    s.load(images, function (start) {
      start();
    });



## Installation

### Browsers

    <script src="scripts/sprinkler.js"></script>

### CommonJS & Node.js (not yet available in npm)

    $ npm install sprinkler
    ---
    > var Sprinkler = require('sprinkler');

### AMD & Require.js

    define(['scripts/sprinkler'], function (Sprinkler) { ... });



## API

### Sprinkler.create()

### #load(imagePaths, callback(start, stop))



## Notes for developers

Run tests with `$ npm test`. Build with `$ npm run build`.



## Todo

- implementation.
- tests



## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



## License

[MIT License](../blob/master/LICENSE)
