const {Feed} = require('../database/models')

class FeedRepository {
  static getUserFeed (userId, batchSize = 10, timestamp = null) {
    const query = {userId}
    if (timestamp) {
      query.timestamp = {
        $lt: timestamp
      }
    }
    return Feed.find(query).sort({timestamp: -1}).select({activity: 1, _id: 0, timestamp: 1}).limit(batchSize)
  }
}
module.exports = FeedRepository
