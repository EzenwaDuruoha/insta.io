const successPattern = /^(2|3)\d{2}$/

module.exports.jsonResponse = function (res, data = null, status = 200) {
  const payload = {
    status: 'success'
  }
  // if the status code starts with 2 or 3, set satus variable as success
  const isOk = successPattern.test(status)
  let content = data || (!isOk ? 'An Error has occured' : null)
  if (typeof data === 'boolean' && isOk) {
    content = data
  }
  if (!isOk) {
    payload.status = 'error'
  }
  payload.data = content
  return res.status(status).json(payload)
}
