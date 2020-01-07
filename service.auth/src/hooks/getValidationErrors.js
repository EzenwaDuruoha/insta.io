const {useValidatorHook} = require('../middleware/useValidator')

module.exports = (hooks) => {
  const request = hooks.getRequest()
  const context = hooks.getContext()
  const {error, data} = useValidatorHook(request)
  if (error) {
    return context.complete({
      status: 'error',
      data: error,
      code:  400
    })
  }
  hooks.setFrame({data})
}
