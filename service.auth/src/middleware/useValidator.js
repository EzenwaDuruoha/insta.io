const {validationResult, matchedData} = require('express-validator')

function errorFormatter (err) {
  let {msg, param} = err
  if (param[0] === '_') {
    param = param.slice(1)
  }
  return {param, msg}
}

const customChecker = validationResult.withDefaults({
  formatter: errorFormatter
})

module.exports.useValidator = function (req, res, next) {
  const errors = customChecker(req)
  const logger = res.locals.logger
  const ip = req.ip ||
  req._remoteAddress ||
  (req.connection && req.connection.remoteAddress) ||
  undefined
  if (!errors.isEmpty()) {
    logger.info('Validation failed', {ip, url: req.originalUrl, body: req.body, errors: errors.array()})
    return res.status(400).json({
      status: 'error',
      data: errors.array()
    })
  }
  res.locals.data = matchedData(req, {locations: ['body', 'query', 'params']})
  next()
}

module.exports.useValidatorHook = function (req) {
  const errors = customChecker(req)
  if (!errors.isEmpty()) {
    return {error: errors.array(), data: null}
  }
  return {error: null, data: matchedData(req, {locations: ['body', 'query', 'params']})}
}
