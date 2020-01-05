const InstaRelationService = require('../../services/HTTP/InstaRelationService')

async function _call (frame = {}, method = '', ...args) {
  const {config: {network: {relationService}}, context: {token}, logger} = frame
  try {
    const service = new InstaRelationService(relationService)
    const chain = method.trim().split('.')
    let call = service
    chain.forEach((c) => {
      call = [c]
    })
    const response = await call(...args, token)
    if (response.data === true) {
      frame.meta.premissions.push(response)
      return true
    }
  } catch (error) {
    logger.error(error, {tag: 'PERMISSION_CALL_PROXY'})
  }
  return false
}

module.exports.isFollowing = async (actor, related, frame = {}) => {
  return _call(frame, 'social.isFollowing', actor, related)
}

module.exports.canView = async (actor, related, frame = {}) => {
  return _call(frame, 'access.canView', actor, related)
}

module.exports.checkBlocked = (frame) => {
  return {error: null, data: frame}
}

module.exports.checkPrivate = (frame) => {
  return {error: null, data: frame}
}

module.exports.hasTag = (frame) => {
  return {error: null, data: frame}
}

module.exports.hasRole = (frame) => {
  return {error: null, data: frame}
}
