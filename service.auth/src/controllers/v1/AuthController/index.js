const {login, register} = require('./actions')
const builder = require('../../../utils/apiBuilder')
const {getValidationErrors, getRelatedResource} = require('../../../hooks')
const userResource = require('../../../helpers/common/userResourceConf')

class AuthController {
  login (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runCustom(getRelatedResource(userResource(), {spreadArgs: true, identifier: 'user'}))
      .runCustom((hooks) => {
        const {relatedResources: {user}} = hooks.getFrame()
        if (!user) {
          const context = hooks.getContext()
          context.complete({
            status: 'error',
            data: 'User Doesn\'t Exist',
            code: 404
          })
        }
      })
      .runCustom((hooks) => {
        const {data: {password}, relatedResources: {user}} = hooks.getFrame()
        if (!user.validatePassword(password)) {
          const context = hooks.getContext()
          context.complete({
            status: 'error',
            data: 'Incorrect Password',
            code: 400
          })
        }
      })
      .runController(login)
  }

  register (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runCustom(getRelatedResource(userResource({call: 'userExits', hydrate: null}), {spreadArgs: false, identifier: 'foundUser'}))
      .runCustom((hooks) => {
        const {relatedResources: {foundUser}} = hooks.getFrame()
        if (foundUser) {
          const context = hooks.getContext()
          context.complete({
            status: 'error',
            data: 'Email or Username Taken',
            code: 400
          })
        }
      })
      .runController(register)
  }
}

module.exports = AuthController
