// {path: 'params', fields: {id: ['isUUID']}}
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const validations = require('../validation/common')
const {asyncForEach} = require('../helpers/functionHelper')

async function _check (frame, config) {
  const {path, fields} = config
  if (!path || !fields) throw new Error('Invalid Validation Config')
  const foundPath = frame[path]
  if (!foundPath) throw new Error('Invalid Path Parameter')
  if (typeof fields !== 'object') throw new Error('Invalid Field Parameter')
  const keys = Object.keys(fields)

  await asyncForEach(keys, async (key) => {
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
    const valid = await validator(value)
    if (!valid) throw new Error(`Validation Failed: ${key}`)
  })
}

module.exports = function (config = {}) {
  return async (hooks) => {
    const frame = hooks.getFrame()
    const context = hooks.getContext()
    try {
      await _check(frame, config)
    } catch (error) {
      logger.error(error)
      context.complete({
        status: 'error',
        data: error.message,
        code: 400
      })
    }
  }
}
