/* eslint-disable require-atomic-updates */
const moment = require('moment')
const UserDataLayer = require('../repos/userDataLayer')
const {REDIS_SESSION_BLACKLIST_KEY} = require('../constants/redis')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})
const {getServices} = require('../core')
const config = require('../../config')

module.exports = async function (req, res, next) {
  const {headers: {authorization}} = req
  const {jwt: {issuer}, jwtCerts: {publicKey}} = config
  const {dbService, redisService, jwtService} = getServices()

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
    res.locals.userContext = {
      user,
      token: authorization,
      tokenData: token,
      isAuthenticated: true
    }
    next()
  } catch (error) {
    next(error)
  }
}
