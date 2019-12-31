const BaseHTTPService = require('./BaseHTTPService')

class InstaUserService extends BaseHTTPService {
  get user () {
    return {
      verifyToken: (token) => this.get('/api/v1/user', {headers: {Authorization: token}})
    }
  }
}
module.exports = InstaUserService
