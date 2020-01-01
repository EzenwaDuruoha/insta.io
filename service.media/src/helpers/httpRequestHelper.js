module.exports.getip = function (req) {
  return req.ip ||
    req._remoteAddress ||
    (req.connection && req.connection.remoteAddress) ||
    undefined
}

module.exports.getUserAgent = function (req) {
  return req.headers['user-agent']
}

module.exports.getHttpVersion = function (req) {
  return req.httpVersionMajor + '.' + req.httpVersionMinor
}

module.exports.getReferrer = function (req) {
  return req.headers.referer || req.headers.referrer
}

module.exports.getStatus = function (req, res) {
  return String(res.statusCode)
}

module.exports.getMethod = function (req) {
  return req.method
}

module.exports.getUrl = function (req) {
  return req.originalUrl || req.url
}
