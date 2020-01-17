const BaseHTTPService = require('./BaseHTTPService')

class CeleryService extends BaseHTTPService {
  get user () {
    return {
      verifyToken: (token) => this.get('/api/v1/user', {headers: {Authorization: token}})
    }
  }
}
module.exports = CeleryService
