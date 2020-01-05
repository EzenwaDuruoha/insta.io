const BaseHTTPService = require('./BaseHTTPService')

class InstaRelationService extends BaseHTTPService {
  get access () {
    return {
      canView: (actor, related, token) => this.post('/api/v1/access/post/view', {actor, related}, {
        headers:
        {Authorization: token}
      })
    }
  }

  get social () {
    return {
      isFollowing: (actor, related, token) => this.post('/api/v1/social/is/following', {actor, related}, {
        headers:
        {Authorization: token}
      })
    }
  }
}
module.exports = InstaRelationService
