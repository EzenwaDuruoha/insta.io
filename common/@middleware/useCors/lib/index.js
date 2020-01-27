const cors = require('cors')

module.exports = function (whitelist = [], skip = false) {
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || skip) {
        callback(null, true)
      } else {
        callback(new Error('Request Blocked by CORS'), false)
      }
    }
  }
  return cors(corsOptions)
}
