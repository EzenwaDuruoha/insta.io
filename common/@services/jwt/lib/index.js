const jwt = require('jsonwebtoken')
const util = require('util')
const uuid = require('uuid/v4')

const verify = util.promisify(jwt.verify)

class JWTService {
  constructor () {
    this.defaults = {
      audience: '',
      subject: '',
      issuer: '',
      expiresIn:'12h',
    }
  }

  generateToken (secret, claim, options = {}, algorithm = 'RS256') {
    const config = {
      ...this.defaults,
      jwtid: uuid(),
      algorithm,
      ...options
    }
    return jwt.sign(claim, secret, config)
  }

  async verifyToken (secret, token, options = {}, algorithms = ['RS256']) {
    const config = {
      ...this.defaults,
      algorithms,
      ...options
    }
    return verify(token, secret, config)
  }

  decodeToken (token) {
    return jwt.decode(token, {complete: true, json: true})
  }
}

module.exports = JWTService
