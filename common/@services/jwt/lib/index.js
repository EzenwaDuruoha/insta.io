const jwt = require('jsonwebtoken')
const util = require('util')
const uuid = require('uuid/v4')

const verify = util.promisify(jwt.verify)
/**
 * The JSON Web Token Options.
 * @typedef {Object} JWTOptions
 * @property {uuid} jwtid
 * @property {String | Array<String>} algorithm
 * @property {String} issuer
 * @property {String} audience
 * @property {String} subject
 */

/**
  * @typedef {Object} User
  * @property {uuid} id
  */

class JWTService {
  /**
   *
   * @param {String} secret
   * @param {User} claim
   * @param {JWTOptions} options
   * @param {String | Array<String>} algorithm
   */
  generateToken (secret, claim, options = {}, algorithm = 'RS256') {
    const config = {
      jwtid: uuid(),
      algorithm,
      ...options
    }
    return jwt.sign(claim, secret, config)
  }

  /**
   *
   * @param {String} secret
   * @param {String} token
   * @param {JWTOptions} options
   * @param {String | Array<String>} algorithms
   */
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

  /**
   *
   * @param {String} token
   */
  decodeToken (token) {
    return jwt.decode(token, {complete: true, json: true})
  }
}

module.exports = JWTService
