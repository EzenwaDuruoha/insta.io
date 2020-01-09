const apiBuilder = require('../../util/http/apiBuilder')
const get = require('./actions/get')
const {setupSourceRequest, setupReloader} = require('../../hooks/api')

class ClientController {
  get(req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(setupSourceRequest)
      .runCustom(setupReloader)
      .runController(get)
  }
}
module.exports = ClientController
