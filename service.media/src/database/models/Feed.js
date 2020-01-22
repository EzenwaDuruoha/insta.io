const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidValidator = require('uuid-validate')

const Schema = mongoose.Schema

const activitySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    select: false
  },
  actor: {
    type: String,
    required: true,
    validate: (id) => {
      return uuidValidator(id, 4)
    }
  },
  verb: {
    type: String,
    default: 'Post'
  },
  content: {
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
  username: String
})

const FeedSchema = new Schema({
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
  activity: activitySchema,
  timestamp: {
    type: Schema.Types.Date,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
})

FeedSchema.indexes([
  {userId: 1},
  {userId: 1, timestamp: -1}
])

FeedSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const Feed = mongoose.model('Feed', FeedSchema)

module.exports = Feed
