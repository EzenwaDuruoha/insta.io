// eslint-disable-next-line no-unused-vars
const {request, response} = require('express')
const useErrorHandler = require('@middleware/use-error-handler')
const {jsonResponse} = require('../../helpers/httpRequestHelper')
const {REDIS_SESSION_KEY, REDIS_SESSION_BLACKLIST_KEY, USER_DATA_KEY} = require('../../constants/redis')
const {SESSION_INIT} = require('../../constants/notification')
const UserDataLayer = require('../../utils/userDataLayer')

/**
 *
 * @param {request} req
 * @param {response} res
 */
async function loginController (req, res) {
  const {dbService, redisService, mqService, jwtService, data, config: {jwt: {expiresIn}, rabbitmq: {exechangeName}}} = res.locals
  const {username, email, password} = data
  const userDataLayer = new UserDataLayer(dbService)
  const args = username ? {username} : {email}
  const user = await userDataLayer.getUser(args, {
    relations: ['profile', 'settings']
  })

  if (!user) {
    return jsonResponse(res, 'User not found', 404)
  }

  if (!user.validatePassword(password)) {
    return jsonResponse(res, 'Incorrect Password', 404)
  }
  const token = jwtService.generateToken({id: user.id, type: 'app'})
  const sessionKey = REDIS_SESSION_KEY + user.id
  const userDataKey = USER_DATA_KEY + user.id

  const {error: tokenError, data: activeToken} = await redisService.get(sessionKey)

  if (!tokenError && activeToken) {
    const {payload: {jti}} = jwtService.decodeToken(activeToken)
    const blacklistKey = REDIS_SESSION_BLACKLIST_KEY + jti
    const {data: expire} = await redisService.ttl(sessionKey)
    await redisService.set(blacklistKey, activeToken, 'EX', expire)
  }

  const exp = parseInt(expiresIn) / 1000
  const json = user.toJSON(['password', 'deleted'])
  redisService.set(sessionKey, token, 'EX', exp)
  redisService.set(userDataKey, JSON.stringify(json), 'EX', exp)

  setImmediate(() => {
    mqService.publish(json, exechangeName, {
      persist: false,
      headers: {
        notificationType: SESSION_INIT,
        relatedToUser: user.id
      }
    })
  })

  return jsonResponse(res, {user: json, token}, 200)
}

module.exports = useErrorHandler(loginController)
