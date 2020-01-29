const {USER_FEED, DEFAULT_FEED} = require('../../../../constants')

function getFeedIds (feed = [], logger) {
  return feed.map((item) => {
    try {
      if (typeof item === 'string') {
        item = JSON.parse(item)
      }
      const {activity} = item
      return activity.content
    } catch (error) {
      logger.error(error)
      return ''
    }
  })
}

module.exports = async function (frame) {
  const {logger, dependencies: {feedRepo, redisService}, context: {user}} = frame
  let feed = []
  let feedIds = []
  const userKey = USER_FEED + user.id
  const {data} = await redisService.lrange(userKey, 0, 20)
  feed = data

  if (!feed || !feed.length) {
    feed = await feedRepo.getUserFeed(user.id, 20)
    const parsed = feed.map((f) => {
      feedIds.push(f.activity.content)
      return JSON.stringify(f)
    })
    if (!parsed.length) {
      const defaultFeed = JSON.stringify(DEFAULT_FEED)
      parsed.push(defaultFeed)
    }
    redisService.rpush(userKey, ...parsed)
  } else {
    feedIds = getFeedIds(feed, logger)
  }
  const hydratedFeed = await feedRepo.hydrateFeed(feedIds)

  return {
    status: 'success',
    data: hydratedFeed || [],
    code: 200
  }
}
