const {REDIS_SESSION_KEY, REDIS_SESSION_BLACKLIST_KEY} = require('../../../../constants/redis')

module.exports = async (frame) => {
  const {dependencies: {redisService, jwtService}, context: {user, token}} = frame
  const sessionKey = REDIS_SESSION_KEY + user.id

  const {payload: {jti}} = jwtService.decodeToken(token)
  const blacklistKey = REDIS_SESSION_BLACKLIST_KEY + jti
  const {data: expire} = await redisService.ttl(sessionKey)

  if (expire) {
    await redisService.set(blacklistKey, token, 'EX', expire)
  }

  return {
    status: 'success',
    data: true,
    code: 204
  }
}
