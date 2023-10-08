const {REDIS_SESSION_KEY, REDIS_SESSION_BLACKLIST_KEY, USER_DATA_KEY} = require('../../../../constants/redis')
const {SESSION_INIT} = require('../../../../constants/notification')

module.exports = async (frame) => {
  console.log('Change')
  const {config, dependencies, relatedResources: {user}} = frame
  const {redisService, mqService, jwtService} = dependencies
  const {jwt, jwtCerts: {privateKey}, rabbitmq: {exechangeName}} = config
  const {expiresIn} = jwt

  const token = jwtService.generateToken(privateKey, {id: user.id, username: user.username}, {...jwt, audience: 'Public.Api', subject: 'Client'})
  const sessionKey = REDIS_SESSION_KEY + user.id
  const userDataKey = USER_DATA_KEY + user.id

  const {error: tokenError, data: activeToken} = await redisService.get(sessionKey)

  console.log("Super hotfix")

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

  return {
    status: 'success',
    data: {user: json, token},
    code: 200
  }
}
