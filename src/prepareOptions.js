var DEFAULT_OPTIONS = require('./defaultOptions')
var pickValid = require('./lib/pickValid')

module.exports = function (options) {
  // Validate and fill the user-given options.
  //
  // Return
  //   valid options object
  //
  // Throw if invalid.
  //

  // No options object given.
  if (typeof options === 'undefined') {
    options = {}
  }

  // Invalid parameter
  if (Object.prototype.toString.call(options) !== '[object Object]') {
    throw new Error('Invalid options: ' + JSON.stringify(options))
  }

  // Filter: pick all valid options, take others from defaults.
  var validOptions = pickValid(options, DEFAULT_OPTIONS)

  // If there was no tail, validOptions.tail is the default one.
  // If there were tail specs, they might be partial.
  if (typeof options.tail === 'object') {
    validOptions.tail = pickValid(options.tail, DEFAULT_OPTIONS.tail)
  }

  return validOptions
}
