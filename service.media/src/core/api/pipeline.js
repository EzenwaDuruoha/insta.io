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

module.exports.proccessRunner = proccessRunner

const STAGES = {
  access: (frame, config) => {
    if (!config) return frame
    return proccessRunner(permissions, frame, config.permissions)
  },
  authentication: (frame, config) => {
    if (!config) return frame
    return proccessRunner(authenticators, frame, config.authenticators)
  },
  validation: async (frame, config) => {
    if (!config) return frame
    const {path, fields} = config
    if (!path || !fields) throw new Error('Invalid Validation Config')
    const foundPath = frame[path]
    if (!foundPath) throw new Error('Invalid Path Parameter')
    if (typeof fields !== 'object') throw new Error('Invalid Field Parameter')
    const keys = Object.keys(fields)
    keys.forEach((key) => {
      const value = foundPath[key]
      if (!value) throw new Error(`Invalid Value: ${key}`)
      let check = fields[key]
      if (!check) throw new Error(`Invalid Validators for check: ${key}`)
      if (typeof check === 'string') {
        check = [check]
      } else if (!Array.isArray(check)) {
        check = [JSON.stringify(check)]
      }
      const validator = validations[check]
      if (!validator) throw new Error('Invalid Validator')
      const valid = validator(value)
      if (!valid) throw new Error(`Validation Failed: ${key}`)
    })
    return frame
  }
}
module.exports.pipeline = (frame, config = {}) => {
  console.log(' ')
  console.log('PIPELINE', config)
  console.log(' ')
  const logger = frame.logger
  return Promise.resolve()
    .then(() => {
      return STAGES.authentication(frame, config.authentication)
    })
    .then((f) => {
      return STAGES.validation(f, config.validation)
    })
    .then((f) => {
      return STAGES.access(f, config.access)
    })
    .catch((error) => {
      logger.error(error, {tag: 'PIPELINE_RUNNER'})
      return false
    })
}
