const errorHandler = require('@middleware/use-error-handler')
const uuidValidator = require('uuid-validate')
const {jsonResponse} = require('../../../helpers/responseHelper')
const CommmentRepository = require('../../../repos/commentRepo')

async function getCommentsController (req, res) {
  const {id} = req.params
  if (!uuidValidator(id, 4)) {
    return jsonResponse(res, 'Invalid Id Parameter', 400)
  }
  const comment = await CommmentRepository.get({_id: id}, false)
  if (!comment) {
    return jsonResponse(res, 'Comment Not Found', 400)
  }
  return jsonResponse(res, comment.toJSON(), 200)
}

module.exports = errorHandler(getCommentsController)
