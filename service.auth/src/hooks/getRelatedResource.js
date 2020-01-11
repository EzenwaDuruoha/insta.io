/**
  *
  * args: {path, value}
  * args: {or: [
        {path, value}
      ],
      and: [
        {path, value}
      ]
    }
  *
 */

/**
 *
 * @param {*} args
 * @param {*} frame
 */
async function getArgsSingle (args, frame, ignoreFalsy = false) {
  const store = frame[`${args.path}`]
  if (!store) throw new Error(`Path: [ ${args.path} ] Doesn't Exist in Frame`)
  const found = store[`${args.value}`]
  if (ignoreFalsy && !found) {
    return undefined
  }
  let valid = (found !== undefined)
  if (args.validator && typeof args.validator === 'function') {
    valid = await args.validator(found)
  }
  if (!valid) throw new Error(`[ ${args.value} ] Value Invalid: ${found}`)
  return {[args.value]: found}
}

/**
 *
 * @param {*} args
 * @param {*} frame
 */
function getArgsAdv (args, frame) {
  const allowed = Object.keys(args).filter((key) => (['or', 'and'].includes(key)))
  return allowed.reduce(async (reducer, key) => {
    const conf = args[key]
    reducer[key] = []
    if (!Array.isArray(conf)) throw new Error(`[${key}] Must be an Array`)
    if (!conf.length) throw new Error(`[${key}] Cannot be empty`)
    for (const c of conf) {
      if (typeof c !== 'object' || !c.path || !c.value) throw new Error(`Invalid Config in [${key}]`)
      const found = await getArgsSingle(c, frame, (key === 'or'))
      if (found) {
        reducer[key].push(found)
      }
    }
    return reducer
  }, {})
}

/**
 *
 * @param {*} args
 * @param {*} frame
 */
async function getArgs (args, frame) {
  const argType = typeof args
  if (argType !== 'object') throw new Error('Invalid Arg Type: args should be an Object')
  if (args.path && args.value) {
    return getArgsSingle(args, frame)
  }
  if (!args.or && !args.and) throw new Error('Invalid Arg Type: Require "or" or "and"')
  return getArgsAdv(args, frame)
}

/**
 *
 */
module.exports = function (params = {}, meta = {}) {
  const {args = {}, service = '', call = '', hydrate = null} = params
  const {spreadArgs = false, identifier = '', passPath = null} = meta
  return async (hooks) => {
    const frame = hooks.getFrame()
    const context = hooks.getContext()
    const {dependencies, relatedResources} = frame

    try {
      if (!args || !service || !call) throw new Error('Invalid {args or service or call} Value')
      const handler = dependencies[service]
      if (!handler) throw new Error(`[${service}] Doesn't Exist in Dependency list`)
      if (!handler[call] || typeof handler[call] !== 'function') throw new Error(`${call} is not a method on ${service}`)

      let resource = null
      let foundArgs = null

      if (passPath) {
        if (!frame[passPath]) throw new Error(`[${passPath}] not found in frame`)
        foundArgs = frame[passPath]
      } else {
        foundArgs = await getArgs(args, frame)
      }

      if (typeof hydrate === 'function') {
        foundArgs = await hydrate(foundArgs, frame)
      }

      if (spreadArgs) {
        resource = await handler[call](...foundArgs)
      } else {
        resource = await handler[call](foundArgs)
      }

      hooks.setFrame({relatedResources: {...relatedResources, [identifier]: resource}})
    } catch (error) {
      const logger = frame.logger
      logger.error(error)
      context.complete({
        status: 'error',
        data: error.message,
        code:  400
      })
    }
  }
}
