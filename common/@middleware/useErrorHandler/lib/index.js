/**
 * @param {Function} fn
 */
module.exports = function (fn) {
  /**
   *
   * @param {request} req
   * @param {response} res
   */
  return async function (req, res, next) {
    try {
      return await fn(req, res)
    } catch (error) {
      next(error)
    }
  }
}
