const {login, register} = require('./actions')
const builder = require('../../../utils/apiBuilder')
const {getValidationErrors, getRelatedResource} = require('../../../hooks')

const userResource = {
  args: [
    {path: 'data', value: 'username'},
    {path: 'data', value: 'email'}
  ],
  service: 'userDataLayer',
  call: 'getUser',
  hydrate: (data) => {
    const o = Object.keys(data).map((k) => ({[k]: data[k]}))
    return [o, {
      relations: ['profile', 'settings']
    }]
  }
}
class AuthController {
  login (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runCustom(getRelatedResource(userResource, {spreadArgs: true, identifier: 'user'}))
      .runController(login)
  }

  register (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .runController(register)
  }
}

module.exports = AuthController
