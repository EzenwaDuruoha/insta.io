module.exports = async function (frame) {
  const {dependencies: {socialDataLayer}, context: {user}, relatedResources: {followed}, params: {action}} = frame
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
