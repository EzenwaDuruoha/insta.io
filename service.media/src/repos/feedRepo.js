const {Feed, Posts} = require('../database/models')

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

  static hydrateFeed (ids = []) {
    console.log('FEEDIDS:', ids)
    return Posts.aggregate([
      {
        $match: {
          _id: {
            $in: ids
          }
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'relatedTo',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'relatedTo',
          as: 'likes'
        }
      },
      {
        $set: {
          likeCount: {$size: '$likes'},
        }
      },
      {
        $project: {
          __v: 0,
          created_at: 0,
          last_updated: 0,
          likes: 0,
          'tags.description': 0,
          'tags.created_at': 0,
          'tags.last_updated': 0,
          'tags.__v': 0,
          'comments.description': 0,
          'comments.created_at': 0,
          'comments.last_updated': 0,
          'comments.__v': 0
        }
      }
    ]).exec()
  }
}
module.exports = FeedRepository
