module.exports = async function postGet (frame) {
  const {dependencies: {postRepo}, params: {id}} = frame
  const post = await postRepo.get({_id: id})

  return {
    status: post ? 'success' : 'error',
    data: post || null,
    code: post ? 200 : 404
  }
}
