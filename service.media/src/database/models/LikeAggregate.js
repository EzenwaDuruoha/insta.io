const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidValidator = require('uuid-validate')
const {MODEL_ACTIVITY_ACTORS} = require('../../constants')

const Schema = mongoose.Schema
const LikeAggregateSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  relatedTo: {
    type: String,
    required: true,
    refPath: 'actor',
    validate: (id) => {
      return uuidValidator(id, 4)
    }
  },
  actor: {
    type: String,
    required: true,
    enum: MODEL_ACTIVITY_ACTORS
  },
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated'
  }
})

LikeAggregateSchema.statics.lookup = function (opt, extendPipeLine = []) {
  const lookup = []
  const getLookup = (path) => {
    const relatedSchema = this.schema.path(path)
    const ref = relatedSchema.caster ? relatedSchema.caster.options.ref : relatedSchema.options.ref
    const rel = mongoose.model(ref)
    return {
      $lookup: {
        from: rel.collection.name,
        as: path,
        localField: path,
        foreignField: '_id'
      }
    }
  }

  if (Array.isArray(opt.path)) {
    opt.path.forEach((path) => {
      lookup.push(getLookup(path))
    })
  } else {
    lookup.push(getLookup(opt.path))
  }

  const pipeline = [
    ...lookup,
    {$match: opt.query},
    ...extendPipeLine
  ]
  console.log(pipeline)
  return this.aggregate(pipeline).exec()
  // .then(r => {
  //   return r.map(m => {
  //     return this({ ...m, [opt.path]: m[opt.path].map(r => rel(r)) })
  //   })
  // })
}

LikeAggregateSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const LikeAggregate = mongoose.model('LikeAggregate', LikeAggregateSchema)

module.exports = LikeAggregate
