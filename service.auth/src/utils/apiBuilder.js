const createBuilder = require('@utils/apibuilder')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})
const config = require('../../config')
const {getServices} = require('../core')
const UserDataLayer = require('./UserDataLayer')
const SocialDataLayer = require('./SocialDataLayer')

const services = getServices()
const userDataLayer = new UserDataLayer(services.dbService)
const socialDataLayer = new SocialDataLayer(services.dbService)

const builder = createBuilder({
  logger,
  config,
  context: {
    user: null,
    token: null,
    tokenData: null,
    isAuthenticated: false,
  },
  dependencies: Object.assign(services, {userDataLayer, socialDataLayer}),
  relatedResources: {}
})

builder.addListener('error', (error) => {
  logger.error(error, {tag: 'BUILDER_STATIC'})
})

builder.defineStaticMethod('setFrameUserContext', (hooks) => {
  return () => {
    const queue = hooks.getQueue()
    queue.add(async () => {
      const {locals: {userContext}} = hooks.getResponse()
      if (userContext) {
        hooks.setFrame({context: userContext})
      }
    }, {name: 'setFrameUserContext'})
    return hooks.getContext()
  }
})

// builder.addListener('queue', (data) => {
//   logger.info('API Builder Queue Event', {tag: 'BUILDER_STATIC', ...data})
// })

module.exports = builder
