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
    const startTime = Date.now()

    function logResponse () {
      const responseTime = (Date.now() - startTime) + 'ms'
      const userId = !res.locals.user ? null : (res.locals.user.id) ? res.locals.user.id : null
      const details = getLogDetails(req, res)

      logger.info('REQUEST', {...details, ...meta, responseTime, userId})
      res.removeListener('finish', logResponse)
      res.removeListener('close', logResponse)
    }

    res.on('finish', logResponse)
    res.on('close', logResponse)
    res.locals.logger = logger
    next()
  }
}
