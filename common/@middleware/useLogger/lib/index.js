const getters = require('./getters')

function getLogDetails (req, res) {
  const properties = {
    method: getters.getMethod,
    httpVersion: getters.getHttpVersion,
    status: getters.getStatus,
    url: getters.getUrl,
    ip: getters.getip,
    userAgent: getters.getUserAgent,
    headers: getters.getHeaders
  }
  return Object.keys(properties).reduce((reducer, key) => {
    const handler = properties[key]
    if (handler) {
      reducer[key] = handler(req, res)
    }
    return reducer
  }, {})
}

module.exports = function (logger = null, meta = {}) {
  if (!logger) {
    logger = console
  }
  return function (req, res, next) {
    const details = getLogDetails(req, res)
    logger.info('REQUEST', {...details, ...meta})
    res.locals.logger = logger
    next()
  }
}
