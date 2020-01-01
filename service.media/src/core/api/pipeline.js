const authenticators = require('../utils/authentication')
const permissions = require('../utils/permission')
const validations = require('../utils/validation')
const {asyncForEach} = require('../../helpers/functionHelper')

const proccessRunner = async (handlers = {}, frame, config) => {
  let extendFrame = frame
  if (!config) throw new Error('Process Config Missing')
  if (typeof config === 'string') {
    config = [config]
  } else if (!Array.isArray(config)) {
    config = [JSON.stringify(config)]
  }
  if (!config.includes('skip')) {
    await asyncForEach(config, async (a) => {
      const handler = handlers[a]
      if (!handler) throw new Error('Process Config Invalid')
      const {error, data} = await handler(extendFrame)
      if (error) throw error
      // eslint-disable-next-line require-atomic-updates
      extendFrame = data
    })
  }
  return extendFrame
}

const STAGES = {
  access: proccessRunner.bind(null, permissions),
  authentication: proccessRunner.bind(null, authenticators),
  validation: proccessRunner.bind(null, )
}
module.exports.pipeline = (frame, config = {}) => {
  const logger = frame.logger
  return Promise.resolve()
    .then(() => {
      return STAGES.authentication(frame, config.authenticator)
    })
    .then((f) => {
      return STAGES.permission(f, config.permission)
    })
    .catch((error) => {
      logger.error(error, {tag: 'PIPELINE_RUNNER'})
      return false
    })
}
