const uuid = require('uuid/v4')
const PostRepository = require('../../../../repos/postRepo')
const S3Service = require('../../../../services/AWS/S3Service')
const {jsonResponse} = require('../../../../helpers/responseHelper')
const {postContentBucket, cdnHost} = require('../../../../../config')
const {CONTENT_TYPES_TO_EXTENSION} = require('../../../../constants')

async function postCreate (req, res) {
  const {data, user} = res.locals
  if (!user || !user.id) return jsonResponse(res, 'Not Authenticated', 403)
  const extension = CONTENT_TYPES_TO_EXTENSION[data.contentType]
  const postKey = `${user.id}/posts/${uuid()}${extension}`
  data.userId = user.id
  data.contentURL = [`${cdnHost}/${postContentBucket}/${postKey}`]

  const s3Service = new S3Service()
  const post = await PostRepository.create(data)
  const {data: signedURL} = await s3Service.generateUploadURL(postContentBucket, postKey, {
    ContentType: data.contentType,
    ACL:'public-read'
  })
  return jsonResponse(res, {
    id: post.id,
    uploadUrl: signedURL
  }, 200)
}

module.exports = postCreate
