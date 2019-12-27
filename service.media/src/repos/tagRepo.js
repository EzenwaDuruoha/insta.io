const uuidv4 = require('uuid/v4')
const {Tags} = require('../database/models')

class TagRepository {
  static async updateOrCreate (query, data = {}, opts = {}) {
    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      ...opts
    }
    return Tags.findOneAndUpdate(query, data, options)
  }
}

module.exports = TagRepository
