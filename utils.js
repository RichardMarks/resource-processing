const path = require('path')
const child = require('child_process')

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
  promiseCreateImage,
  promiseGetImageSize,
  promiseResizeImage,
  promiseCenteredCompositeImage,
  promiseRecursiveErase
}
