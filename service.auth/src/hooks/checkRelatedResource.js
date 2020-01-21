module.exports = function (config = {}) {
  const {value, validator, message = {}, not = false} = config
  const _message = Object.assign({
    400: 'Validation Failed',
    404: 'Resource Not Found'
  }, message)
  return (hooks) => {
    const frame = hooks.getFrame()
    const context = hooks.getContext()
    const {relatedResources} = frame
    const found = relatedResources[value]
    if (!found && !not) {
      return context.complete({
        status: 'error',
        data: _message['404'],
        code: 404
      })
    }
    if (found && not) {
      return context.complete({
        status: 'error',
        data: _message['400'],
        code: 400
      })
    }
    if (typeof validator === 'function' && !validator(found, frame)) {
      return context.complete({
        status: 'error',
        data: _message['400'],
        code: 400
      })
    }
  }
}
