const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

const Schema = mongoose.Schema
const TagSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    dropDups: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated'
  }
})

TagSchema.set('toJSON', {
  transform: function (doc, ret, opt) { // eslint-disable-line
    delete ret.__v
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag
