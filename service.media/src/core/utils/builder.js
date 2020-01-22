const createBuilder = require('@utils/apibuilder')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const PostRepository = require('../../repos/postRepo')
const CommentRepository = require('../../repos/commentRepo')
const FeedRepository = require('../../repos/feedRepo')
const TagRepository = require('../../repos/tagRepo')
const S3Service = require('../../services/AWS/S3Service')
const config = require('../../../config')
const {getServices} = require('../')

const builder = createBuilder({
  logger,
  config,
  context: {
    user: null,
    token: null,
    tokenData: null,
    isAuthenticated: false,
  },
  dependencies: {
    ...getServices(),
    postRepo: PostRepository,
    commentRepo: CommentRepository,
    tagRepo: TagRepository,
    feedRepo: FeedRepository,
    s3Service: new S3Service()
  },
  meta: {
    permissions: [],
    relatedObjects: {}
  }
})

builder.addListener('error', (error) => {
  logger.error(error, {tag: 'BUILDER_STATIC'})
})

// builder.addListener('queue', (data) => {
//   logger.info('API Builder Queue Event', {tag: 'BUILDER_STATIC', ...data})
// })

builder.defineStaticMethod('setFrameUserContext', (hooks) => {
  return () => {
    const queue = hooks.getQueue()
    queue.add(async () => {
      const {locals: {userContext}} = hooks.getResponse()
      if (userContext) {
        hooks.setFrame({context: userContext})
      }
    }, {name: 'setFrameUserContext'})
    return hooks.getContext()
  }
})
module.exports = builder
