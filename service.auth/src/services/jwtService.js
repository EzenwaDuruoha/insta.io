const jwt = require('jsonwebtoken')
const util = require('util')
const uuid = require('uuid/v4')

const verify = util.promisify(jwt.verify)

class JWTService {
  constructor (options, secret) {
    this.options = options
    this.secret = secret
  }

  generateToken (claim, audience = 'agg.io', subject = 'user') {
    const config = {...this.options, subject, audience, jwtid: uuid()}
    return jwt.sign(claim, this.secret, config)
  }

  async verifyToken (token, audience = 'agg.io', subject = 'user') {
    const config = {...this.options, subject, audience}
    return verify(token, this.secret, config)
  }

  decodeToken (token) {
    return jwt.decode(token, {complete: true, json: true})
  }
}

module.exports = JWTService
