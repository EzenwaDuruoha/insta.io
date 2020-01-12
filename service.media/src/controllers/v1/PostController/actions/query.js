async function postQuery (frame) {
  const {dependencies: {postRepo}, data} = frame
  const {id, and, or} = data
  if (and && or) {
    return {
      status: 'error',
      data: 'Only a Single Query Operation can be Performed',
      code: 400
    }
  }

  if (id) {
    const post = await postRepo.get({_id: id})
    return {
      status: 'success',
      data: post,
      code: 200
    }
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
  const posts = await postRepo.lookup(queryBuilder, extendPipeline)

  return {
    status: 'success',
    data: posts,
    code: 200
  }
}

module.exports = postQuery
