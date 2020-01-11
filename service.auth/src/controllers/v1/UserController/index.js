const {get, update} = require('./actions')
const builder = require('../../../utils/apiBuilder')
const {getValidationErrors, getRelatedResource} = require('../../../hooks')
const userResource = require('../../../helpers/common/userResourceConf')

class UserController {
  get (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runCustom(getRelatedResource(userResource({
        hydrate: (data) => {
          let q = data.or
          if (!q) {
            q = data.and
          }
          if (!q) {
            q = data
          }
          if (!Array.isArray(q)) {
            q = [q]
          }
          return q
        }
      }), {passPath: false, identifier: 'user'}))
      .runController(get)
  }

  session (req, res, next) {
    return builder(req, res, next)
      .runCustom((hooks) => {
        const {locals: {userContext: {user}}} = hooks.getResponse()
        const context = hooks.getContext()
        context.complete({
          status: user ? 'success' : 'error',
          data: user ? user.toJSON(['password', 'deleted']) : 'User Not Found',
          code: user ? 200 : 400
        })
      })
  }

  update (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .setFrameUserContext()
      .runController(update)
  }

  delete (req, res, next) {}
}

module.exports = UserController
