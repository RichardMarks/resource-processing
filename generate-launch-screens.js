const path = require('path')

const yargs = require('yargs')

const utils = require('./utils')

const { LAUNCH_SCREEN_RESOURCE_TABLE } = require('./mobile-resource-tables')

async function generateLaunchScreens ({
  backgroundColor,
  source,
  coveragePercentage
}) {
  const launchScreenIds = Object.keys(LAUNCH_SCREEN_RESOURCE_TABLE)
  const sourceBasename = path.basename(source, path.extname(source))
  const coverageFactor = coveragePercentage * 0.01
  const n = launchScreenIds.length

  let idx = 0

  for (const launchScreenId of launchScreenIds) {
    idx++
    console.log(`\x1b[0m\x1b[2J\x1b[0;0HProcessing launch screen image ${idx} / ${n}`)

    const targetSizeDef = LAUNCH_SCREEN_RESOURCE_TABLE[launchScreenId]
    const [ targetWidth, targetHeight ] = targetSizeDef.split('x').map(Number)
    const targetFilename = `${launchScreenId}_${targetWidth}x${targetHeight}.png`
    const targetPath = path.resolve(TARGET_DIR, targetFilename)

    // determine the maximum coverage percentage dimension
    const coverWidth = coverageFactor * targetWidth
    const coverHeight = coverageFactor * targetHeight
    const coverSize = Math.ceil(Math.max(coverWidth, coverHeight))
    const coverFilename = `${sourceBasename}_${coverSize}x${coverSize}.png`
    const coverPath = path.resolve(COVER_DIR, coverFilename)

    const compositeFilename = targetFilename
    const compositePath = path.resolve(FINAL_DIR, compositeFilename)

    // generate an image of the target dimensions filled with background color
    // console.log('creating target image', targetPath)
    try {
      await utils.promiseCreateImage(targetWidth, targetHeight, backgroundColor, targetPath)
    } catch (err) {
      console.error(err)
    }

    // resize launch screen source to coverage percentage dimension
    // console.log('creating cover image', coverPath)
    try {
      await utils.promiseResizeImage(source, coverSize, coverSize, coverPath)
    } catch (err) {
      console.error(err)
    }

    // composite the launch screen source on top the target canvas
    // console.log('creating composite image', compositePath)
    try {
      await utils.promiseCenteredCompositeImage(coverPath, targetPath, compositePath)
    } catch (err) {
      console.error(err)
    }

    /*
      https://docs.meteor.com/api/mobile-config.html#App-launchScreens

      "For Android, launch screen images should be special "Nine-patch" image files that specify how they should be stretched."

      https://developer.android.com/guide/topics/graphics/drawables#nine-patch
    */
    if (launchScreenId.startsWith('android')) {
      const left = Math.floor((targetWidth - coverSize) * 0.5)
      const top = Math.floor((targetHeight - coverSize) * 0.5)
      const right = left + coverSize
      const bottom = top + coverSize
      const slice = utils.createSlice(left, top, right, bottom)
      try {
        await utils.promiseNinePatchifyImage(slice, compositePath, compositePath)
      } catch (err) {
        console.error(err)
      }
    }
  }

  console.log('Cleaning Up Temporaries...')
  try {
    await utils.promiseRecursiveErase(TARGET_DIR)
    await utils.promiseRecursiveErase(COVER_DIR)
  } catch (err) {
    console.error(err)
  }
  console.log(`Finished.\nLook inside ${FINAL_DIR} for your processed launch screen images`)
}

const options = yargs
  .coerce(['source', 'workspace'], path.resolve)
  .default('workspace', 'workspace')
  .default('source', 'source.png')
  .option('workspace', {
    alias: 'w',
    describe: 'Working Directory'
  })
  .option('source', {
    alias: 's',
    describe: 'Source Image'
  })
  .demandOption(['s', 'w'])
  .argv

const WORKSPACE_DIR = options.workspace
const TARGET_DIR = path.resolve(WORKSPACE_DIR, 'temp_targets')
const COVER_DIR = path.resolve(WORKSPACE_DIR, 'temp_covers')
const FINAL_DIR = path.resolve(WORKSPACE_DIR, 'launch_screens')

generateLaunchScreens({
  source: options.source,
  coveragePercentage: 30,
  backgroundColor: '#ffffff'
})
