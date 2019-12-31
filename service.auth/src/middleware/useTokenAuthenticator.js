/* eslint-disable require-atomic-updates */
const moment = require('moment')
const UserDataLayer = require('../utils/userDataLayer')
const {REDIS_SESSION_BLACKLIST_KEY} = require('../constants/redis')

module.exports = async function (req, res, next) {
  const {headers: {authorization}} = req
  const {config: {jwt: {issuer}, jwtCerts: {publicKey}}, dbService, redisService, jwtService, logger} = res.locals

  if (!authorization) {
    return res.status(403).json({
      status: 'error',
      message: 'Authentcation Token not found'
    })
  }

  try {
    const {error: tokenError, payload: token} = await jwtService.verifyToken(publicKey, authorization, {issuer})

    if (tokenError) {
      logger.error(tokenError, {tag: 'useTokenAuthenticator', info: 'Verify Token failed'})
      return res.status(403).json({
        status: 'error',
        message: 'Invalid Authentcation Token'
      })
    }

    const {id, jti, iss, exp} = token
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

    const blackListKey = REDIS_SESSION_BLACKLIST_KEY + jti
    const {error, data} = await redisService.get(blackListKey)

    if (error) {
      logger.error(error, {tag: 'useTokenAuthenticator', info: 'Failed to verify blacklisted token'})
      return res.status(403).json({
        status: 'error',
        message: 'Blacklisted Authentcation Token'
      })
    }

    if (!error && data) {
      return res.status(403).json({
        status: 'error',
        message: 'Blacklisted Authentcation Token'
      })
    }

    const userDataLayer = new UserDataLayer(dbService)
    const user = await userDataLayer.getUser({id})
    if (!user) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid Authentcation Token'
      })
    }
    res.locals.user = user
    res.locals.token = authorization
    res.locals.isAuthenticated = true
    next()
  } catch (error) {
    next(error)
  }
}
