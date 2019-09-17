var path = require('path')

module.exports = {
  entry: './index',
  output: {
    filename: 'sprinkler.min.js',
    path: path.join(__dirname, '/dist'),
    sourceMapFilename: '[file].map',
    library: 'Sprinkler', // module name in global scope
    libraryTarget: 'umd'
  },

  devtool: 'source-map',

  mode: 'production'
}
