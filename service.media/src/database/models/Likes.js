const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidValidator = require('uuid-validate')
const {MODEL_ACTIVITY_ACTORS} = require('../../constants')

const Schema = mongoose.Schema
const LikeSchema = new Schema({
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

LikeSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const Like = mongoose.model('Like', LikeSchema)

module.exports = Like
