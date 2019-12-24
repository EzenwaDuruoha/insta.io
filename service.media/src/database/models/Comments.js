const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidValidator = require('uuid-validate')
const {MODEL_ACTIVITY_ACTORS} = require('../../constants')

const Schema = mongoose.Schema
const CommentSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  body: {
    type: String,
    default: ''
  },
  relatedTo: {
    type: String,
    required: true,
    refPath: 'actor',
    validate: (id) => {
      return uuidValidator(id, 4)
    }
  },
  userId: {
    type: String,
    required: true,
    validate: (id) => {
      return uuidValidator(id, 4)
    }
  },
  actor: {
    type: String,
    required: true,
    enum: MODEL_ACTIVITY_ACTORS
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated'
  }
})

CommentSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
