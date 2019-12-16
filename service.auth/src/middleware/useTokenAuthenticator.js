const UserDataLayer = require('../utils/userDataLayer')
const {JsonWebTokenError} = require('jsonwebtoken')
const {REDIS_SESSION_BLACKLIST_KEY} = require('../constants/redis')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})

module.exports = async function (req, res, next) {
  const {headers: {authorization}} = req
  const {config, dbService, redisService, jwtService} = res.locals

  if (!authorization) {
    return res.status(403).json({
      status: 'error',
      message: 'Authentcation Token not found'
    })
  }

  try {
    const {id, jti, iss} = await jwtService.verifyToken(authorization)
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

    if (iss !== config.jwt.issuer) {
      return res.status(403).json({
        status: 'error',
        message: 'Falsified Token'
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
    // eslint-disable-next-line require-atomic-updates
    res.locals.user = user
    next()
  } catch (error) {
    logger.error(error, {tag: 'useTokenAuthenticator', info: 'Failed to verify token'})
    if (error instanceof JsonWebTokenError) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid Authentcation Token'
      })
    } else {
      next(error)
    }
  }
}
