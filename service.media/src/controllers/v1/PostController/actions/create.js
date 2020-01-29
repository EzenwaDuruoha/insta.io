const uuid = require('uuid/v4')
const {CONTENT_TYPES_TO_EXTENSION} = require('../../../../constants')

async function postCreate (frame) {
  const {data, context: {user}, config:{postContentBucket, cdnHost}, dependencies: {postRepo, s3Service, worker}} = frame
  const extension = CONTENT_TYPES_TO_EXTENSION[data.contentType]
  const postKey = `${user.id}/posts/${uuid()}${extension}`
  data.userId = user.id
  data.username = user.username
  data.contentURL = [`${cdnHost}/${postContentBucket}/${postKey}`]

  const post = await postRepo.create(data)
  const {data: signedURL} = await s3Service.generateUploadURL(postContentBucket, postKey, {
    ContentType: data.contentType,
    ACL:'public-read'
  })
  const activity = {
    actor: user.id,
    verb: 'Post',
    content: post.id,
    contentURL: data.contentURL,
    username: user.username || '',
    timestamp: post.created_at
  }
  worker.dispatch('dispatch_feed_fanout', activity)
  return {
    status: 'success',
    data: {
      id: post.id,
      uploadUrl: signedURL
    }
  }
}

module.exports = postCreate
