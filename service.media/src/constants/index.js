const redisConstants = require('./redis')
const feedConstants = require('./feed')

module.exports.MODEL_ACTIVITY_ACTORS = ['Comment', 'Post']
module.exports.ALLOWED_MEDIA_CONTENT_TYPES = [
  'image/bmp',
  'video/x-msvideo',
  'image/gif',
  'image/jpeg',
  'video/ogg',
  'image/png',
  'image/tiff',
  'video/webm',
  'image/webp',
  'video/3gpp'
]
module.exports.CONTENT_TYPES_TO_EXTENSION = {
  'image/bmp': '.bmp',
  'video/x-msvideo': '.avi',
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'video/ogg': '.ogg',
  'image/png': '.png',
  'image/tiff': '.tiff',
  'video/webm': '.webm',
  'image/webp': '.webp',
  'video/3gpp': '.3gp'
}

module.exports = Object.assign(module.exports, redisConstants, feedConstants)
