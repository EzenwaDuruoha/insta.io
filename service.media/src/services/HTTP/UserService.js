const BaseHTTPService = require('./BaseHTTPService')

class UserService extends BaseHTTPService {
  get user () {
    return {
      verifyToken: (token) => this.get('/api/v1/user', {headers: {Authorization: token}})
    }
  }
}
module.exports = UserService
