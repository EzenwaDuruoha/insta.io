
module.exports = async (frame) => {
  const {relatedResources: {user}} = frame
  return {
    status: user ? 'success' : 'error',
    data: user ? user.toJSON(['confirmed',
      'password',
      'deleted',
      'confirmed_on',
      'last_access',
      'created_at',
      'last_update']) : 'User not Found',
    code: user ? 200 : 404
  }
}
