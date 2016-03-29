/**
  ## convolution method
  Internal method to apply convolution filter
  !!! this method does not return ImageObject

  ### Parameters
    - imageData `Object`: ImageData object
    - option `Object` : Option object

  ### Example
      //code sample goes here
 */
function convolution (imgData, option) {
  // check options object & set default variables
  option = option || {}
  option.monochrome = option.monochrome || false
  option.divisor = option.divisor || 1
  if (!option.filter || !option.radius) {
    throw new Error('Required options missing. filter : ' + option.filter + ', radius: ' + option.radius)
  }

  // Check length of data & avilable pixel size to make sure data is good data
  var pixelSize = imgData.width * imgData.height
  var dataLength = imgData.data.length
  var colorDepth = dataLength / pixelSize
  if (colorDepth !== 4 && colorDepth !== 1) {
    throw new Error('ImageObject has incorrect color depth')
  }
  var newPixelData = new Uint8ClampedArray(pixelSize * (option.monochrome || 4))

  var height = imgData.height
  var width = imgData.width
  var f = option.filter
  var r = option.radius
  var ch, y, x, fy, fx, arr, sum, i

  // do convolution math for each channel
  for (ch = 0; ch < colorDepth; ch++) {
    for (y = r; y < height - r; y++) {
      for (x = r; x < width - r; x++) {
        i = (x + y * width) * colorDepth + ch
        if (ch === 3) {
          newPixelData[i] = imgData.data[i]
          continue
        }

        arr = []
        for (fy = -r; fy < r * 2; fy++) {
          for (fx = -r; fx < r * 2; fx++) {
            arr.push(imgData.data[(x + fx + (y + fy) * width) * colorDepth + ch])
          }
        }
        sum = arr.map(function (data, index) { return data * f[index] }).reduce(function (p, n) { return p + n })
        newPixelData[i] = sum / option.divisor
      }
    }

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        i = (x + y * width) * colorDepth + ch
        // copy colors from top & bottom rows
        if (y < r || y > height - (r * 2)) {
          newPixelData[i] = imgData.data[i]
          continue
        }
        // copy colors from left and write columns
        if (x < r || x > width - (r * 2)) {
          newPixelData[i] = imgData.data[i]
        }
      }
    }
  }
  return formatter(newPixelData, imgData.width, imgData.height)
}
