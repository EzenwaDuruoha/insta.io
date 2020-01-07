
module.exports = async (frame) => {
  const {relatedResources: {user}} = frame
  const json = user.toJSON(['password', 'deleted'])
  return {
    status: 'success',
    data: json,
    code: 200
  }
}
