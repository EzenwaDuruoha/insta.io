const {USER_FEED} = require('../../../../constants')

module.exports = async function feedGet (frame) {
  const {logger, dependencies: {feedRepo, redisService}, context: {user}} = frame
  let feed = []
  const userKey = USER_FEED + user.id
  const {data} = await redisService.lrange(userKey, 0, 20)
  feed = data

  if (!feed || !feed.length) {
    feed = await feedRepo.getUserFeed(user.id, 20)
    const parsed = feed.map((f) => JSON.stringify(f))
    redisService.rpush(userKey, ...parsed)
  } else {
    feed = feed.reduce((reducer, f) => {
      try {
        if (typeof f === 'string') {
          reducer.push(JSON.parse(f))
        } else {
          reducer.push(f)
        }
      } catch (error) {
        logger.error(error)
      }
      return reducer
    }, [])
  }

  return {
    status: 'success',
    data: feed,
    code: 200
  }
}
