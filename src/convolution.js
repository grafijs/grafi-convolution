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
  option.divisor =  option.divisor || 1
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

  var channels = colorDepth === 1 ? 1 : 3
  var height = imgData.height
  var width = imgData.width
  var f = option.filter
  console.log(f)
  console.log(f.length)
  var r = option.radius
  var fSize = r * 2
  var c, p, ch, y, x, fy, fx, _arr, _sum, _i

  // create container for each color channel
  var channelsData =[]
  for (c = 0; c < channels; c++) {
    channelsData.push(new Uint8ClampedArray(pixelSize))
  }
  // put data in each channel arrays
  for (p = 0; p < pixelSize; p++) {
    if (colorDepth === 1) {
      channelsData[0][p] = imgData.data[p]
      continue
    }
      channelsData[0][p] = imgData.data[p * colorDepth ]
      channelsData[1][p] = imgData.data[p * colorDepth + 1]
      channelsData[2][p] = imgData.data[p * colorDepth + 2]
  }

  // console.log(channelsData  )

  // // do convolution for each channel
  for (ch = 0; ch < colorDepth; ch++){
    for (y = r; y < height - r; y++) {
      for (x = r; x < width - r; x++) {
        _i = x + y * width
        if(ch === 3){
          // console.log(imgData.data[_i * colorDepth + ch])
          newPixelData[_i * colorDepth + ch] = imgData.data[_i * colorDepth + ch]
          continue
        }

        _arr = []
        for (fy = -r; fy < fSize; fy++) {
          for (fx = -r; fx < fSize; fx++) {
              _arr.push(channelsData[ch][x + fx + (y + fy) * width])
          }
        }
        _sum = _arr.map(function(e, i) {return e * f[i]}).reduce( function(p, n) {return p + n} )
        newPixelData[_i * colorDepth + ch] = _sum / option.divisor
      }
    }
  }

  return formatter(newPixelData, imgData.width, imgData.height)
}
