const {MODEL_EXCLUDES} = require('../../../../constants/system')
module.exports = async (frame) => {
  const {context: {user}, data, dependencies: {dbService, userDataLayer}} = frame
  if (!user) {
    return {
      status: 'error',
      data: 'User not Authenticated',
      code: 403
    }
  }

  const userData = {}
  const profileData = {}
  let userChanged = false
  let profileChanged = false

  const userColumns = Object.keys(dbService.getEntity('UserEntity').options.columns)
    .filter((v) => (!MODEL_EXCLUDES.includes(v)))
  const profileColumns = Object.keys(dbService.getEntity('UserProfileEntity').options.columns)
    .filter((v) => (!MODEL_EXCLUDES.includes(v)))

  Object.keys(data).forEach((key) => {
    if (userColumns.includes(key)) {
      userData[key] = data[key]
      userChanged = true
    }
    if (profileColumns.includes(key)) {
      profileData[key] = data[key]
      profileChanged = true
    }
  })

  if (userChanged) {
    user.update(userData)
    await userDataLayer.updateUser(user.id, user)
  }

  if (profileChanged) {
    const profile = await userDataLayer.getProfile({userId: user.id})
    profile.update(profileData)
    await userDataLayer.updateProfile(profile.id, profile)
  }

  const update = await userDataLayer.getUser({id: user.id}, {relations: ['profile', 'settings']})

  return {
    status: 'success',
    data: update.toJSON(['password', 'deleted']),
    code: 204
  }
}
