const {login, register, logout} = require('./actions')
const builder = require('../../../utils/apiBuilder')
const {getValidationErrors, getRelatedResource, checkRelatedResource} = require('../../../hooks')
const userResource = require('../../../helpers/common/userResourceConf')

class AuthController {
  login (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runCustom(getRelatedResource(userResource(), {spreadArgs: true, identifier: 'user'}))
      .runCustom(checkRelatedResource({
        value: 'user',
        validator: (user, frame) => user.validatePassword(frame.data.password),
        message: {400: 'Invalid Password', 404: 'User not Found'}
      }))
      .runController(login)
  }

  register (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runCustom(getRelatedResource(userResource({
        call: 'userExits',
        hydrate: (data) => {
          let q = data.or
          if (!q) {
            q = data.and
          }
          if (!q) {
            q = data
          }
          if (Array.isArray(q)) {
            q = q.reduce((r, s) => {
              return Object.assign(r, s)
            }, {})
          }
          return q
        }
      }),
      {spreadArgs: false, identifier: 'foundUser'}))
      .runCustom(checkRelatedResource({value: 'foundUser', not: true, message: {400: 'User Already Exists'}}))
      .runController(register)
  }

  logout (req, res, next) {
    return builder(req, res, next)
      .setFrameUserContext()
      .runController(logout)
  }
}

module.exports = AuthController
