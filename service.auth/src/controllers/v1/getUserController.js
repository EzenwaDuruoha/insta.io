// eslint-disable-next-line no-unused-vars
const {request, response} = require('express')
const UserDataLayer = require('../../utils/userDataLayer')
const useErrorHandler = require('@middleware/use-error-handler')
const {jsonResponse} = require('../../helpers/httpRequestHelper')

/**
 *
 * @param {request} req
 * @param {response} res
 */
async function getUserController (req, res) {
  const {dbService, data} = res.locals
  const userDataLayer = new UserDataLayer(dbService)
  const user = await userDataLayer.getUser(data)
  if (!user) {
    return jsonResponse(res, 'User not found', 404)
  }
  const json = user.toJSON(['password', 'deleted'])
  return jsonResponse(res, {user: json}, 200)
}

module.exports = useErrorHandler(getUserController)
