module.exports = (hooks) => {
  const {context: {user}, relatedResources: {followed}} = hooks.getFrame()
  const context = hooks.getContext()
  if (!followed) {
    return context.complete({
      status: 'error',
      data: 'User Does not Exist',
      code: 404
    })
  }
  if (user.id === followed.id) {
    return context.complete({
      status: 'error',
      data: 'Cannot Follow Self',
      code: 400
    })
  }
}
