/* eslint-disable require-atomic-updates */
const moment = require('moment')

module.exports.jwtAuthenticator = async function (frame) {
  const {request, core: {jwtService}, config} = frame
  const {authorization} = request.headers
  const {jwt: {issuer}, jwtCerts: {publicKey}} = config

  if (!authorization) return {error: new Error('Token Not Found'), data: false}

  const {error, payload: token} = await jwtService.verifyToken(publicKey, authorization, {issuer})
  if (error) return {error, data: false}

  const {iss, exp, id} = token
  const expire = moment((exp * 1000))
  if (expire.isBefore()) return {error: new Error('Token Expired'), data: false}

  if (iss !== issuer) return {error: new Error('Falsied Token'), data: false}
  return {
    error: null,
    data: {
      ...frame,
      context: {
        user: {
          id
        },
        token: authorization,
        tokenData: token,
        isAuthenticated: true,
      }
    }
  }
}

module.exports.apiKeyAuthenticator = async function (frame) {
  frame.polo = 2
  return {error: null, data: frame}
}
