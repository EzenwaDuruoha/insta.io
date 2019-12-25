const uuidv4 = require('uuid/v4')
const {Posts, PostMeta} = require('../database/models')
const TagRepository = require('./tagRepo')

class PostRepository {
  async create (data = {}) {
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
    const post =  await Posts.create({_id, ...data})
    const tagModels = await Promise.all(tags.map((tag) => TagRepository.updateOrCreate({name: tag}, {name: tag})))
    const metaModel = await PostMeta.create({relatedTo: post.id, meta})
    post.tags = tagModels
    post.meta = metaModel
    return await post.save()
  }

  async createMany (data = []) {
    return Posts.insertMany(data, {ordered: true})
  }

  async get (args = {}) {
    return Posts.findOne(args).populate({
      path: 'tags',
      select: 'name',
    })
    .populate({
      path: 'meta',
      select: 'meta',
    })
      .exec()
  }

  async find (query = {}, chain = false) {
    const q = Posts.find(query).populate({
      path: 'tags',
      select: 'name',
    })
    .populate({
      path: 'meta',
      select: 'meta',
    })
    if (!chain) {
      return q.exec()
    }
    return q
  }

  async update (id, data = {}) {
    return Posts.findOneAndUpdate({_id: id}, data, {
      new: true,
      runValidators: true
    })
  }

  async delete (id) {
    return Posts.findOneAndUpdate({_id: id}, {deleted: true}, {
      new: true,
      runValidators: true
    })
  }
}

module.exports = PostRepository
