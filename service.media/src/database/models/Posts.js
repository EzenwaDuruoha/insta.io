const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidValidator = require('uuid-validate')
const {ALLOWED_MEDIA_CONTENT_TYPES} = require('../../constants')

const Schema = mongoose.Schema
const PostSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  userId: {
    type: String,
    required: true,
    validate: (id) => {
      return uuidValidator(id, 4)
    }
  },
  username: {
    type: String,
    default: ''
  },
  contentURL: [{
    type: String,
    required: true,
    default: ''
  }],
  contentType: {
    type: String,
    enum: ALLOWED_MEDIA_CONTENT_TYPES
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    longitude: {
      type: Schema.Types.Decimal128,
      default: null
    },
    latitude: {
      type: Schema.Types.Decimal128,
      default: null
    }
  },
  tags: [{type: String, ref: 'Tag'}],
  meta: {type: String, ref: 'PostMeta'},
  title: {
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated'
  }
})

PostSchema.statics.lookup = function (opt, extendPipeLine = []) {
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
  return this.aggregate(pipeline).exec()
  // .then(r => {
  //   return r.map(m => {
  //     return this({ ...m, [opt.path]: m[opt.path].map(r => rel(r)) })
  //   })
  // })
}

PostSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
