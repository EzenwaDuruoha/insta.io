const apiBuilder = require('../../../core/utils/builder')
const {checkValidationErrors, useValidation, useAccessControl} = require('../../../hooks')
const {get, create, query} = require('./actions')

class PostController {
  get (req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(useValidation({path: 'params', fields: {id: ['isUUID']}}))
      .setFrameUserContext()
      .runCustom(useAccessControl({resource: 'Post', permissions: 'canView'}))
      .runController(get)
  }

  create (req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(checkValidationErrors)
      .setFrameUserContext()
      .runController(create)
  }

  query (req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(checkValidationErrors)
      .setFrameUserContext()
      .runController(query)
  }
}

module.exports = PostController
