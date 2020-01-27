const logger = require('@utils/logger').getLogger({service: 'Media.Web'})
const createBuilder = require('@utils/apibuilder')
const config = require('../../../config')

const builder = createBuilder({
  logger,
  config,
  context: {},
  core: {},
  dependencies: {},
  relatedResources: {}
})

builder.addListener('error', (error) => {
  logger.error(error, {tag: 'BUILDER_STATIC'})
})

module.exports = builder
