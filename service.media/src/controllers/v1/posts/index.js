const BaseController = require('../../BaseController')
const PostRepository = require('../../../repos/postRepo')
const apiBuilder = require('../../../core/api/builder')
const {get, create, query} = require('./actions')

class PostController extends BaseController {
  get (req, res, next) {
    return apiBuilder(req, res, next)
      .addDependency({postRepo: PostRepository})
      .setPipeline('authentication', {authenticators: ['jwtAuthenticator']})
      .runPipeline()
      .setPipeline('validation', {path: 'params', fields: {id: ['isUUID']}})
      .runPipeline()
      .setPipeline('access', {permissions: 'isFriend'})
      .runPipeline()
      .runController(get)
  }
}

module.exports = PostController
