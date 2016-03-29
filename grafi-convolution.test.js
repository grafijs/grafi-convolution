var assert = require('assert')
var grafi = require('./grafi-convolution.js')

var imageData = grafi.convolution({data: [255, 255, 255, 255, ], width: 1, height: 1})

assert(imageData.constructor.toString().match(/function\s(\w*)/)[1] === 'ImageData',
  'returned object is an instance of ImageData')
