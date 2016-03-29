;(function(){

import '../node_modules/grafi-formatter/src/formatter'
import 'convolution'

  var grafi = {}
  grafi.convolution = convolution

  if (typeof module === 'object' && module.exports) {
    module.exports = grafi
  } else {
    this.grafi = grafi
  }
}())
