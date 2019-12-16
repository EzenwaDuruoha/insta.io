const useErrorHandler = require('@middleware/use-error-handler')
const {jsonResponse} = require('../../helpers/httpRequestHelper')
const {REDIS_SESSION_KEY, USER_DATA_KEY} = require('../../constants/redis')
const {SESSION_INIT, REGISTRATION_COMPLETE} = require('../../constants/notification')
const UserDataLayer = require('../../utils/userDataLayer')

/**
 * @param {request} req
 * @param {response} res
 */
async function registerController (req, res) {
  const {dbService, redisService, mqService, jwtService, data, config: {jwt: {expiresIn}}} = res.locals
  const {username, email, password} = data
  const userDataLayer = new UserDataLayer(dbService)

  const found = await userDataLayer.userExits(username, email)
  if (found) {
    return jsonResponse(res, 'User Already Exits', 400)
  }

  const user = await userDataLayer.createUser(username, email, password)
  const profile = await userDataLayer.createUserProfile(user)
  const settings = await userDataLayer.createUserSettings(user)

  const token = jwtService.generateToken({id: user.id, type: 'app'})
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
    mqService.publish({userId: user.id, email, username, createdAt: user.created_at}, {
      persist: true,
      headers: {
        notificationType: REGISTRATION_COMPLETE,
        relatedToUser: user.id
      }
    })
    mqService.publish(json, {
      persist: false,
      headers: {
        notificationType: SESSION_INIT,
        relatedToUser: user.id
      }
    })
  })
  return jsonResponse(res, {user: json, token}, 200)
}

module.exports = useErrorHandler(registerController)
