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

module.exports = function (req) {
  const errors = customChecker(req)
  if (!errors.isEmpty()) {
    return {error: errors.array(), data: null}
  }
  return {error: null, data: matchedData(req, { locations: ['body'] })}
}
