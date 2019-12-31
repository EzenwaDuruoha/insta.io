module.exports = async function (req, res, next) {
  try {
    const {headers} = req
    const {userService} = res.locals
    const userContex = headers['x-api-user']
    const authorization = headers.authorization
    if (!authorization) {
      return res.status(403).json({
        status: 'error',
        message: 'Authentication Token not found'
      })
    }
    res.locals.token = authorization
    res.locals.isAuthenticated = true
    if (userContex) {
      res.locals.user = JSON.parse(userContex)
    } else {
      const response = await userService.user.verifyToken(authorization)
      if (response.status === 'success') {
        // eslint-disable-next-line require-atomic-updates
        res.locals.user = response.data
      } else {
        return res.status(403).json(response)
      }
    }
  } catch (error) {
    res.locals.logger.error(error, {tag: 'user_hydrate_middleware'})
    return res.status(403).json({
      status: 'error',
      message: 'Authentication Failed'
    })
  }
  next()
}
