module.exports = async function (frame) {
  const {data: {id}, params: {stat}, dependencies: {socialDataLayer}} = frame
  const results = await socialDataLayer.getFollows(id, stat)
  return {
    status: 'success',
    data: results,
    code: 200
  }
}
