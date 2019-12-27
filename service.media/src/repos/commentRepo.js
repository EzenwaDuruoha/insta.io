const uuidv4 = require('uuid/v4')
const {Comments} = require('../database/models')

class CommentRepository {
  static validateData (payload = {}, exclude = []) {
    if (typeof payload !== 'object') return false
    const required = [
      '_id',
      'body',
      'relatedTo',
      'userId',
      'actor'
    ]
    return required.every((key) => {
      if (exclude.includes(key)) return true
      return !!payload[key]
    })
  }

  static async updateOrCreate (query, data = {}, opts = {}) {
    if (!this.validateData(data, ['_id'])) return false
    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      ...opts
    }
    return Comments.findOneAndUpdate(query, data, options)
  }

  static async create (data = {}) {
    if (!this.validateData(data, ['_id'])) return false
    return Comments.create({...data})
  }

  static async get (query = {}, fetchRelated = true, ...args) {
    let q = Comments.findOne(query, ...args)
    if (fetchRelated) {
      q = q.populate({
        path: 'relatedTo',
      })
    }
    return q.exec()
  }
}

module.exports = CommentRepository
