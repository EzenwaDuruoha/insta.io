const fs = require('fs')
const utils = require('util')
const mustache = require('mustache')

const readFile = utils.promisify(fs.readFile)

module.exports = async function (frame) {
  const {
    config,
    logger,
    core: {reader = readFile},
    context: {templatePath = `${config.staticPath}/index.html`, sourceRequest = {}}
  } = frame
  try {
    const buffer = await reader(templatePath)
    const template = mustache.render(buffer.toString(), {
      sourceRequest: JSON.stringify(sourceRequest)
    })
    return template
  } catch (error) {
    logger.error(error, {tag: 'CLIENT_GET_ROUTE'})
    return 'ERROR'
  }
}