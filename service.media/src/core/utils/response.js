const successPattern = /^(2|3)\d{2}$/

class Response {
  constructor (res, {status = 'success', data = null, code = 200, message = null, headers = {}, meta = {}}) {
    this.statusCode = typeof code === 'number' ? code : isNaN(parseInt(code)) ? 200 : parseInt(code)
    this.body = {
      status: typeof status === 'string' ? status : successPattern.test(this.statusCode) ? 'success' : 'error',
      data: data || message || null,
      meta
    }
    this.headers = headers
    res.status(this.statusCode)
    res.set(headers)
  }

  toJson () {
    return this.body
  }
}
module.exports = Response
