const BaseController = require('../../BaseController')
const PostRepository = require('../../../repos/postRepo')
const apiBuilder = require('../../../core/api/builder')
const {get, create, query} = require('./actions')

class PostController extends BaseController {
  get (req, res, next) {
    return apiBuilder(req, res, next)
      .addDependency({postRepo: PostRepository})
      .setPipeline({authenticator: ['jwtAuthenticator']})
      .runPipeline()
      .runController(get)
  }
}

module.exports = PostController
