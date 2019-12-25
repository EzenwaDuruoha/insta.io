const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

const Schema = mongoose.Schema
const PostMetaSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  relatedTo: {
    type: String,
    ref: 'Post'
  },
  meta: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated'
  }
})

PostMetaSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const PostMeta = mongoose.model('PostMeta', PostMetaSchema)

module.exports = PostMeta
