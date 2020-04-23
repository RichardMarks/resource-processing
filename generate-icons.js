const path = require('path')
const yargs = require('yargs')
const utils = require('./utils')
const { ICON_RESOURCE_TABLE } = require('./mobile-resource-tables')

async function generateIcons ({ source, ICONS_DIR }) {
  const iconIds = Object.keys(ICON_RESOURCE_TABLE)

  const n = iconIds.length
  let idx = 0

  for (const iconId of iconIds) {
    idx++
    console.log(`\x1b[0m\x1b[2J\x1b[0;0HProcessing icon image ${idx} / ${n}`)
    const targetSizeDef = ICON_RESOURCE_TABLE[iconId]
    const [ targetWidth, targetHeight ] = targetSizeDef.split('x').map(Number)
    const targetFilename = `${iconId}_${targetWidth}x${targetHeight}.png`
    const targetPath = path.resolve(ICONS_DIR, targetFilename)

    try {
      await utils.promiseResizeImage(source, targetWidth, targetHeight, targetPath)
    } catch (err) {
      console.error(err)
    }
  }

  console.log(`Finished.\nLook inside ${ICONS_DIR} for your processed icon images`)
}

const options = yargs
  .coerce(['source', 'workspace'], path.resolve)
  .default('workspace', 'workspace')
  .default('source', 'icon-source.png')
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
const ICONS_DIR = path.resolve(WORKSPACE_DIR, 'icons')

generateIcons({ source: options.source, ICONS_DIR })
