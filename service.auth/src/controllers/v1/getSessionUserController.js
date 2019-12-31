const {request, response} = require('express')
const useErrorHandler = require('@middleware/use-error-handler')
const {jsonResponse} = require('../../helpers/httpRequestHelper')

/**
 *
 * @param {request} req
 * @param {response} res
 */
async function getSessionUserController (req, res) {
  const user = res.locals.user
  if (!user) {
    return jsonResponse(res, 'User not Found', 404)
  }
  return jsonResponse(res, user.toJSON(['password', 'deleted']))
}

module.exports = useErrorHandler(getSessionUserController)
