const uuid = require('uuid/v4')
const errorHandler = require('@middleware/use-error-handler')
const PostRepository = require('../../../repos/postRepo')
const S3Service = require('../../../services/AWS/S3Service')
const {jsonResponse} = require('../../../helpers/responseHelper')
const {postContentBucket, cdnHost} = require('../../../../config')
const {CONTENT_TYPES_TO_EXTENSION} = require('../../../constants')

async function createController (req, res) {
  const {data} = res.locals
  const userId = data.userId
  const extension = CONTENT_TYPES_TO_EXTENSION[data.contentType]
  const postKey = `${userId}/posts/${uuid()}${extension}`
  data.contentURL = [`${cdnHost}/${postContentBucket}/${postKey}`]

  const s3Service = new S3Service()
  const post = await PostRepository.create(data)
  const {data: signedURL} = await s3Service.generateUploadURL(postContentBucket, postKey, {ContentType: data.contentType, ACL:'public-read'})
  return jsonResponse(res, {
    id: post.id,
    uploadUrl: signedURL
  }, 200)
}

module.exports = errorHandler(createController)
