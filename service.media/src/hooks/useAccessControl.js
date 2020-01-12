// {resource: 'Post', permissions: 'canView'}
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})

module.exports = function (config = {}) {
  return async (hooks) => {
    const frame = hooks.getFrame()
    const context = hooks.getContext()
    try {
      console.log('[WIP]: ACCESS_CONTROL')
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
