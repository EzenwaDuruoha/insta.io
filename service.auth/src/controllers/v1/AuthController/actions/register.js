const {REDIS_SESSION_KEY, USER_DATA_KEY} = require('../../../../constants/redis')
const {SESSION_INIT, REGISTRATION_COMPLETE} = require('../../../../constants/notification')

module.exports = async (frame) => {
  const {config, dependencies, data: {username, email, password}} = frame
  const {redisService, mqService, jwtService, userDataLayer} = dependencies
  const {jwt, jwtCerts: {privateKey}, rabbitmq: {exechangeName}} = config
  const {expiresIn} = jwt

  const user = await userDataLayer.createUser(username, email, password)
  const profile = await userDataLayer.createUserProfile(user)
  const settings = await userDataLayer.createUserSettings(user)

  const token = jwtService.generateToken(privateKey, {id: user.id, username: user.username}, {...jwt, audience: 'Public.Api', subject: 'Client'})
  const sessionKey = REDIS_SESSION_KEY + user.id
  const userDataKey = USER_DATA_KEY + user.id
  const exp = parseInt(expiresIn) / 1000

  let json = user.toJSON(['password', 'deleted'])
  const profileJSON = profile.toJSON(['__user__', '__has_user__'])
  const settingsJSON = settings.toJSON(['__user__', '__has_user__'])
  json = {...json, profile: profileJSON, settings: settingsJSON}

  redisService.set(sessionKey, token, 'EX', exp)
  redisService.set(userDataKey, JSON.stringify(json), 'EX', exp)

  setImmediate(() => {
    mqService.publish({userId: user.id, email, username, createdAt: user.created_at}, exechangeName, {
      persist: true,
      headers: {
        notificationType: REGISTRATION_COMPLETE,
        relatedToUser: user.id
      }
    })
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
