const {create, get} = require('./actions')
const apiBuilder = require('../../../core/utils/builder')
const {checkValidationErrors, useValidation, useAccessControl} = require('../../../hooks')

class CommentController {
  create (req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(checkValidationErrors)
      .setFrameUserContext()
      .runController(create)
  }

  get (req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(useValidation({path: 'params', fields: {id: ['isUUID']}}))
      .setFrameUserContext()
      .runCustom(useAccessControl({resource: 'Post', permissions: 'canView'}))
      .runController(get)
  }
}
module.exports = CommentController
