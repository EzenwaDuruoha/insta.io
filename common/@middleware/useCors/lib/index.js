const cors = require('cors')

module.exports = function (whitelist = [], env = 'development') {
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || (env !== 'production' && !origin)) {
        callback(null, true)
      } else {
        callback({message: 'Request Blocked by CORS'}, false)
      }
    }
  }
  return cors(corsOptions)
}
