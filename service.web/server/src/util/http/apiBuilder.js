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

builder.addListener('queue', (data) => {
  logger.info('API Builder Queue Event', {tag: 'BUILDER_STATIC', ...data})
})

module.exports = builder
