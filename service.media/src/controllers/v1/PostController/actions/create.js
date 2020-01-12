const uuid = require('uuid/v4')
const {CONTENT_TYPES_TO_EXTENSION} = require('../../../../constants')

async function postCreate (frame) {
  const {data, context: {user}, config:{postContentBucket, cdnHost}, dependencies: {postRepo, s3Service}} = frame
  const extension = CONTENT_TYPES_TO_EXTENSION[data.contentType]
  const postKey = `${user.id}/posts/${uuid()}${extension}`
  data.userId = user.id
  data.contentURL = [`${cdnHost}/${postContentBucket}/${postKey}`]

  const post = await postRepo.create(data)
  const {data: signedURL} = await s3Service.generateUploadURL(postContentBucket, postKey, {
    ContentType: data.contentType,
    ACL:'public-read'
  })
  return {
    status: 'success',
    data: {
      id: post.id,
      uploadUrl: signedURL
    }
  }
}

module.exports = postCreate
