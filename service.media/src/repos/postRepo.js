const uuidv4 = require('uuid/v4')
const {Posts, PostMeta} = require('../database/models')
const TagRepository = require('./tagRepo')

class PostRepository {
  static async create (data = {}) {
    const _id = uuidv4()
    let tags = []
    let meta = {}
    if (data.tags) {
      tags = data.tags
      delete data.tags
    }
    if (data.meta) {
      meta = data.meta
      delete data.meta
    }
    const post = await Posts.create({_id, ...data})
    const tagModels = await Promise.all(tags.map((tag) => TagRepository.updateOrCreate({name: tag}, {name: tag})))
    const metaModel = await PostMeta.create({relatedTo: post.id, meta})
    post.tags = tagModels
    post.meta = metaModel
    return post.save()
  }

  static async createMany (data = []) {
    return Posts.insertMany(data, {ordered: true})
  }

  static async get (query = {}, fetchRelated = true, ...args) {
    let q = Posts.findOne(query, ...args)
    if (fetchRelated) {
      q = q.populate({
        path: 'tags',
        select: 'name',
      })
        .populate({
          path: 'meta',
          select: 'meta',
        })
    }
    return q.exec()
  }

  static find (query = {}, chain = false, fetchRelated = true, ...args) {
    let q = Posts.find(query, ...args)
    if (fetchRelated) {
      q = q.populate({
        path: 'tags',
        select: 'name',
      })
        .populate({
          path: 'meta',
          select: 'meta',
        })
    }
    if (!chain) {
      return q.exec()
    }
    return q
  }

  static async lookup (...args) {
    return Posts.lookup(...args)
  }

  static async update (id, data = {}) {
    return Posts.findOneAndUpdate({_id: id}, data, {
      new: true,
      runValidators: true
    })
  }

  static async delete (id) {
    return Posts.findOneAndUpdate({_id: id}, {deleted: true}, {
      new: true,
      runValidators: true
    })
  }
}

module.exports = PostRepository
