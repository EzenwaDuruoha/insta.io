const errorHandler = require('@middleware/use-error-handler')
const PostRepository = require('../../../repos/postRepo')
const {jsonResponse} = require('../../../helpers/responseHelper')

async function getPostsByQueryController (req, res) {
  const {data} = res.locals
  const {id, and, or} = data
  if (and && or) {
    return jsonResponse(res, 'Only a Single Query Operation can be Performed', 400)
  }
  if (id) {
    const post = await PostRepository.get({_id: id})
    return jsonResponse(res, post, 200)
  }
  const operation = and ? '$and' : '$or'
  const queryBuilder = {
    path: ['tags', 'meta'],
    query: {
      [operation]: []
    }
  }
  const raw = and || or
  Object.keys(raw).forEach((key) => {
    if (key === 'tags') {
      queryBuilder.query[operation].push({'tags.name' : {$in: raw[key]}})
    } else {
      queryBuilder.query[operation].push({[key]: raw[key]})
    }
  })
  const extendPipeline = [{
    $project: {
      'tags.description': 0,
      'tags.created_at': 0,
      'tags.last_updated': 0,
      'tags.__v': 0
    }
  }]
  const posts = await PostRepository.lookup(queryBuilder, extendPipeline)
  return jsonResponse(res, posts, 200)
}

module.exports = errorHandler(getPostsByQueryController)
