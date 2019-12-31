/* eslint-disable require-atomic-updates */
const moment = require('moment')

module.exports = async function (req, res, next) {
  const {headers: {authorization}} = req
  const {config: {jwt: {issuer}, jwtCerts: {publicKey}}, redisService, jwtService, logger} = res.locals

  if (!authorization) {
    return res.status(403).json({
      status: 'error',
      message: 'Authentcation Token not found'
    })
  }

  const {error, payload: token} = await jwtService.verifyToken(publicKey, authorization, {issuer})
  if (error) {
    logger.error(error)
    return res.status(403).json({
      status: 'error',
      message: 'Invalid Authentcation Token'
    })
  }

  const {iss, exp, id} = token
  const expire = moment((exp * 1000))
  if (expire.isBefore()) {
    return res.status(403).json({
      status: 'error',
      message: 'Authentcation Token Expired'
    })
  }

  if (iss !== issuer) {
    return res.status(403).json({
      status: 'error',
      message: 'Falsified Token'
    })
  }
  res.locals.user = {id}
  res.locals.token = authorization
  res.locals.isAuthenticated = true
  next()
}
