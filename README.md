# sprinkler.js<sup>v0.2.0</sup>

With Sprinkler you can make awesome sprite rain effects on canvas. Give it a canvas element and a list of image paths and call start() to make it rain bananas or frogs or anything you can imagine!



## Examples

- [Snowfall](http://rawgit.com/axelpale/sprinkler/master/examples/snowfall.html)
- [Money](http://rawgit.com/axelpale/sprinkler/master/examples/money.html)
- [Bananas](http://rawgit.com/axelpale/sprinkler/master/examples/bananas.html)



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

### CommonJS & Node.js

    $ npm install sprinkler
    ---
    > var Sprinkler = require('sprinkler');

### AMD & Require.js

    define(['scripts/sprinkler'], function (Sprinkler) { ... });



## API

### Sprinkler.create()

### #load(imagePaths, callback(start, stop))



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
