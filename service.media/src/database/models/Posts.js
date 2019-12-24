const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidValidator = require('uuid-validate')

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
  contentURL: [{
    type: String,
    required: true,
    default: ''
  }],
  contentType: {
    type: String,
    enum: ['Photo', 'Video']
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
