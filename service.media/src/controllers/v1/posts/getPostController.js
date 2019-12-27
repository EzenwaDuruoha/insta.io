const errorHandler = require('@middleware/use-error-handler')
const uuidValidator = require('uuid-validate')
const PostRepository = require('../../../repos/postRepo')
const {jsonResponse} = require('../../../helpers/responseHelper')

async function getPostController (req, res) {
  const {id} = req.params
  if (!uuidValidator(id, 4)) {
    return jsonResponse(res, 'Invalid Id Parameter', 400)
  }
  const post = await PostRepository.get({_id: id})
  if (!post) {
    return jsonResponse(res, 'Post Not Found', 400)
  }
  return jsonResponse(res, post.toJSON(), 200)
}

module.exports = errorHandler(getPostController)
