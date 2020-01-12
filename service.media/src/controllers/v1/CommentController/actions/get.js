module.exports = async function (frame) {
  const {dependencies: {commentRepo}, params: {id}} = frame
  const comment = await commentRepo.get({_id: id}, false)

  if (!comment) {
    return {
      status: 'error',
      data: 'Comment Not Found',
      code: 404
    }
  }

  return {
    status: 'success',
    data: comment.toJSON(),
    code: 200
  }
}
