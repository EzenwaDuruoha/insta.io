const jwt = require('jsonwebtoken')
const util = require('util')
const uuid = require('uuid/v4')

const verify = util.promisify(jwt.verify)

class JWTService {
  generateToken (secret, claim, options = {}, algorithm = 'RS256') {
    const config = {
      jwtid: uuid(),
      algorithm,
      ...options
    }
    return jwt.sign(claim, secret, config)
  }

  async verifyToken (secret, token, options = {}, algorithms = ['RS256']) {
    const config = {
      algorithms,
      ...options
    }
    const result = {
      error: null,
      payload: {}
    }
    try {
      result.payload = await verify(token, secret, config)
    } catch (error) {
      result.error = error
    }
    return result
  }

  decodeToken (token) {
    return jwt.decode(token, {complete: true, json: true})
  }
}

module.exports = JWTService
