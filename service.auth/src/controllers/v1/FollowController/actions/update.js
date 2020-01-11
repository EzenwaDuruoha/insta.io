module.exports = async function (frame) {
  const {dependencies: {socialDataLayer}, data, context: {user}, relatedResources: {followed}} = frame
  const {action} = data
  const actionMap = {
    follow: false,
    unfollow: true
  }
  const state = actionMap[action]
  const response = await socialDataLayer.followUpdateOrCreate(user.id, followed.id, state)

  return {
    status: 'success',
    data: {
      ...response.raw[0],
      follower: user.id,
      followed: followed.id
    },
    code: 200
  }
}
