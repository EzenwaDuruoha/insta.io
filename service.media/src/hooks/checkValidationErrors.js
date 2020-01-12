const useValidator = require('../middleware/useValidator')

module.exports = (hooks) => {
  const request = hooks.getRequest()
  const context = hooks.getContext()
  const {error, data} = useValidator(request)
  if (error) {
    return context.complete({
      status: 'error',
      data: error,
      code:  400
    })
  }
  hooks.setFrame({data})
}
