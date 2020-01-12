module.exports = async function (frame) {
  const {context: {user}, dependencies: {postRepo, commentRepo}, data} = frame
  data.userId = user.id

  const {relatedTo, actor} = data
  const callbacks = {
    Post: postRepo.get.bind(postRepo, {_id: relatedTo}, false),
    Comment: commentRepo.get.bind(commentRepo, {_id: relatedTo})
  }

  const cb = callbacks[actor]
  if (!cb) {
    return {
      status: 'error',
      data: 'Invalid Actor',
      code: 400
    }
  }

  const relatedModel = await cb()
  if (!relatedModel) {
    return {
      status: 'error',
      data: 'Related Object Not Found',
      code: 404
    }
  }

  const comment = await commentRepo.create(data)

  return {
    status: 'success',
    data: comment.toJSON(),
    code: 200
  }
}
