const moment = require('moment')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const config = require('../../config')
const {getServices} = require('../core')

module.exports = async function (req, res, next) {
  const {headers: {authorization}} = req
  const {jwt: {issuer}, jwtCerts: {publicKey}} = config
  const {jwtService} = getServices()

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
    console.log(token)
    const {id, username = '', iss, exp} = token
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

    const user = {id, username}
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
