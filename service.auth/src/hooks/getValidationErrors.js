const useValidation = require('../middleware/useValidator')

module.exports = (hooks) => {
  const frame = hooks.getFrame()
  const context = hooks.getContext()
  const {error, data} = useValidation(frame.request)
  if (error) {
    return context.complete({
      status: 'error',
      data: error,
      code:  400
    })
  }
  hooks.setFrame({data})
}
