const fs = require('fs')
const utils = require('util')
const mustache = require('mustache')

const readFile = utils.promisify(fs.readFile)

module.exports = async function (frame) {
  const {
    config,
    logger,
    core: {reader = readFile},
    context
  } = frame
  const {index = `${config.staticPath}/index.html`, sourceRequest = {}} = context

  try {
    const buffer = await reader(index)
    const template = mustache.render(buffer.toString(), {
      sourceRequest: JSON.stringify(sourceRequest)
    })
    return template
  } catch (error) {
    logger.error(error, {tag: 'CLIENT_GET_ROUTE'})
    const errorPage = await readFile(`${config.templatesPath}/errors/500.html`)
    return mustache.render(errorPage.toString())
  }
}
