const createBuilder = require('@utils/apibuilder')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const config = require('../../../config')
const {pipeline} = require('./pipeline')
const {getServices} = require('../')

const builder = createBuilder({
  logger,
  config,
  context: {
    user: null,
    token: null,
    tokenData: null,
    isAuthenticated: false,
  },
  dependencies: getServices(),
  meta: {
    permissions: [],
    relatedObjects: {}
  }
})

builder.addListener('error', (error) => {
  logger.error(error, {tag: 'BUILDER_STATIC'})
})

builder.addListener('queue', (data) => {
  logger.info('API Builder Queue Event', {tag: 'BUILDER_STATIC', ...data})
})

builder.defineStaticProperty('pipeline', {})

builder.defineStaticMethod('setPipeline', (hooks) => {
  return (type, options) => {
    if (typeof options === 'object') {
      const queue = hooks.getQueue()
      queue.add(async () => {
        const {pipeline} = hooks.getProps()
        hooks.setProps({pipeline: {...pipeline, [type]: options}})
      }, {name: 'setPipeline'})
    }
    return hooks.getContext()
  }
})

builder.defineStaticMethod('runPipeline', (hooks) => {
  return () => {
    if (hooks.isComplete()) return hooks.getContext()

    const task = async () => {
      if (hooks.isComplete()) return
      const context = hooks.getContext()
      try {
        const extended = await pipeline(hooks.getFrame(), hooks.getProps().pipeline)
        if (extended instanceof Error) {
          context.complete(extended)
        } else {
          hooks.setFrame(extended)
        }
        hooks.setProps({pipeline: {}})
      } catch (error) {
        logger.error(error, {tag: 'BUILDER_RUN_PIPELINE'})
        context.complete(new Error('Pipeline Failed'))
      }
    }

    const queue = hooks.getQueue()
    queue.add(task, {name: 'runPipeline'})
    return hooks.getContext()
  }
})
module.exports = builder
