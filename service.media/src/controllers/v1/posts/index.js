const BaseController = require('../../BaseController')
const PostRepository = require('../../../repos/postRepo')
const S3Service = require('../../../services/AWS/S3Service')
const apiBuilder = require('../../../core/api/builder')
const useValidation = require('../../../middleware/useValidator')
const {get, create, query} = require('./actions')

class PostController extends BaseController {
  get (req, res, next) {
    return apiBuilder(req, res, next)
      .addDependency({postRepo: PostRepository})
      .setPipeline('authentication', {authenticators: ['jwtAuthenticator']})
      .setPipeline('validation', {path: 'params', fields: {id: ['isUUID']}})
      .setPipeline('access', {resource: 'Post', permissions: 'canView'})
      .runPipeline()
      .runController(get)
  }

  create (req, res, next) {
    return apiBuilder(req, res, next)
      .addDependency({postRepo: PostRepository})
      .addDependency({s3Service: new S3Service()})
      .setPipeline('authentication', {authenticators: ['jwtAuthenticator']})
      .runPipeline()
      .runCustom((hooks) => {
        const frame = hooks.getFrame()
        const context = hooks.getContext()
        const {error, data} = useValidation(frame.request)
        if (error) {
          return context.complete({
            status: 'error',
            data: error,
            code:  400
          })
        }
        hooks.setFrame({data})
      })
      .runController(create)
  }
}

module.exports = PostController
