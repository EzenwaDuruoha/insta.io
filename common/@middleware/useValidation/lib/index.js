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

module.exports = function (req, res, next) {
  const errors = customChecker(req)
  const logger = res.locals.logger
  if (!errors.isEmpty()) {
    logger.info('Validation failed', {url: req.url, body: req.body, errors: errors.array()})
    return res.status(400).json({
      status: 'error',
      data: errors.array()
    })
  }
  res.locals.data = matchedData(req, {locations: ['body']})
  next()
}
