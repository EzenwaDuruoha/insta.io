const errorHandler = require('@middleware/use-error-handler')
const {jsonResponse} = require('../../../helpers/responseHelper')
const PostRepository = require('../../../repos/postRepo')
const CommmentRepository = require('../../../repos/commentRepo')

async function createCommentController (req, res) {
  const {data} = res.locals
  const {relatedTo, actor} = data
  const callbacks = {
    Post: PostRepository.get.bind(PostRepository, {_id: relatedTo}, false),
    Comment: CommmentRepository.get.bind(CommmentRepository, {_id: relatedTo})
  }
  const cb = callbacks[actor]
  if (!cb) {
    return jsonResponse(res, 'Invalid Actor', 400)
  }
  const relatedModel = await cb()
  if (!relatedModel) {
    return jsonResponse(res, 'Related Object Not Found', 400)
  }
  const comment = await CommmentRepository.create(data)

  return jsonResponse(res, comment.toJSON(), 200)
}

module.exports = errorHandler(createCommentController)
