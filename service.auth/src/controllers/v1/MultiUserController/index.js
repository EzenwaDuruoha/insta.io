const {get} = require('./actions')
const builder = require('../../../utils/apiBuilder')
const {getValidationErrors} = require('../../../hooks')

class MultiUserController {
  get (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .setFrameUserContext()
      .runController(get)
  }
}
module.exports = MultiUserController
