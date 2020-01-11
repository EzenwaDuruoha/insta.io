const {update, count} = require('./actions')
const builder = require('../../../utils/apiBuilder')
const {getValidationErrors, getRelatedResource, runFollowChecks} = require('../../../hooks')
const userResource = require('../../../helpers/common/userResourceConf')

class FollowController {
  update (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .setFrameUserContext()
      .runCustom(getRelatedResource(userResource({
        args: {path: 'data', value: 'followed'},
        hydrate: (data) => {
          return {id: data.followed}
        }
      }), {passPath: false, identifier: 'followed'}))
      .runCustom(runFollowChecks)
      .runController(update)
  }

  count (req, res, next) {
    return builder(req, res, next)
      .runCustom(getValidationErrors)
      .setFrameUserContext()
      .runController(count)
  }
}
module.exports = FollowController
