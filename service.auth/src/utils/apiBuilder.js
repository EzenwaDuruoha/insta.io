const createBuilder = require('@utils/apibuilder')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})
const config = require('../../config')
const {getServices} = require('../core')
const UserDataLayer = require('./userDataLayer')

const services = getServices()
const userDataLayer = new UserDataLayer(services.dbService)

const builder = createBuilder({
  logger,
  config,
  context: {
    user: null,
    token: null,
    tokenData: null,
    isAuthenticated: false,
  },
  dependencies: Object.assign(services, {userDataLayer}),
  relatedResources: {}
})

builder.addListener('error', (error) => {
  logger.error(error, {tag: 'BUILDER_STATIC'})
})

builder.addListener('queue', (data) => {
  logger.info('API Builder Queue Event', {tag: 'BUILDER_STATIC', ...data})
})

module.exports = builder