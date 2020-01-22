const apiBuilder = require('../../../core/utils/builder')
const {get} = require('./actions')

class FeedController {
  get (req, res, next) {
    return apiBuilder(req, res, next)
      .setFrameUserContext()
      .runController(get)
  }
}

module.exports = FeedController
