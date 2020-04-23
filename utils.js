const path = require('path')
const child = require('child_process')

function createSlice (left, top, right, bottom) {
  const slice = {
    left,
    top,
    right,
    bottom
  }
  return slice
}

function promiseGetImageSize (filename) {
  return new Promise((resolve, reject) => {
    const command = `magick identify -ping -format "%[fx:w]x%[fx:h]" ${filename}`
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err))
      }
      const [ width, height ] = stdout.match(/(\d+x\d+)/)[0].split('x').map(Number)
      return resolve([ width, height ])
    })
  })
}

const MKDIR_P = filename => `mkdir -p ${path.dirname(filename)}`

function promiseCreateImage (width, height, color, filename) {
  return new Promise((resolve, reject) => {
    const command = `${MKDIR_P(filename)} && magick convert -size ${width}x${height} canvas:${color} -set colorspace sRGB -type truecolormatte PNG32:${filename}`
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve({ width, height, color, filename })
    })
  })
}

function promiseResizeImage (inputFilename, width, height, outputFilename) {
  return new Promise((resolve, reject) => {
    const command = `${MKDIR_P(outputFilename)} && magick convert ${inputFilename} -resize ${width}x${height} ${outputFilename}`
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve({ inputFilename, width, height, outputFilename })
    })
  })
}

function promiseCenteredCompositeImage (imageA, imageB, filename) {
  return new Promise((resolve, reject) => {
    const command = `${MKDIR_P(filename)} && magick composite -gravity center ${imageA} ${imageB} ${filename}`
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve({ imageA, imageB, filename })
    })
  })
}

function validateSlice (slice) {
  if (typeof slice !== 'object') {
    return { valid: false, reason: 'slice info is not an object' }
  }
  const { left, top, right, bottom } = slice
  if (typeof left !== 'number') {
    return { valid: false, reason: 'slice.left is not a number' }
  }
  if (typeof top !== 'number') {
    return { valid: false, reason: 'slice.top is not a number' }
  }
  if (typeof right !== 'number') {
    return { valid: false, reason: 'slice.right is not a number' }
  }
  if (typeof bottom !== 'number') {
    return { valid: false, reason: 'slice.bottom is not a number' }
  }
  if (left >= right) {
    return { valid: false, reason: 'slice.left must be less than slice.right' }
  }
  if (top >= bottom) {
    return { valid: false, reason: 'slice.top must be less than slice.bottom' }
  }
  return { valid: true }
}

// https://developer.android.com/guide/topics/graphics/drawables#nine-patch
/*
  - output image will be saved as dirname(basename(outputFilename, extname(outputFilename)).9.png)

  - adds 1 pixel border of fully transparent #00000000
  - marks slice information with black rgba(0,0,0,1)

  slice: {
    left: Number,
    top: Number,
    right: Number,
    bottom: Number
  }

*/

function promiseNinePatchifyImage (slice, inputFilename, outputFilename) {
  return new Promise((resolve, reject) => {
    const sliceValidation = validateSlice(slice)
    if (!sliceValidation.valid) {
      return reject(new Error(sliceValidation.reason))
    }

    const { left, top, right, bottom } = slice

    const outputDir = path.dirname(outputFilename)
    const outputName = path.basename(outputFilename, path.extname(outputFilename))
    const ninePatchFilename = path.resolve(outputDir, `${outputName}.9.png`)

    const command = [
      MKDIR_P(outputFilename),
      ' && ',
      `magick convert ${inputFilename} -bordercolor transparent -border 1 `,
      `-strokewidth 1 -fill black `,
      `-draw "line ${left - 1},${0} ${left - 1},${0}" `,
      `-draw "line ${0},${top - 1} ${0},${top - 1}" `,
      `-draw "line ${right + 1},${0} ${right + 1},${0}" `,
      `-draw "line ${0},${bottom + 1} ${0},${bottom + 1}" `,
      ` PNG32:${ninePatchFilename}`
    ].join('')

    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve({ slice, inputFilename, outputFilename })
    })
  })
}

function promiseRecursiveErase (rootDir) {
  return new Promise((resolve, reject) => {
    const command = `rm -r ${rootDir}`
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve({ rootDir })
    })
  })
}

module.exports = {
  createSlice,
  promiseCreateImage,
  promiseGetImageSize,
  promiseResizeImage,
  promiseCenteredCompositeImage,
  promiseNinePatchifyImage,
  promiseRecursiveErase
}
