const winston = require('winston')

const isDev = process.env.NODE_ENV === 'development'

function replaceErrors (key, value) {
  if (value instanceof Buffer) {
    return value.toString('base64')
  } else if (value instanceof Error) {
    const error = {}

    Object.getOwnPropertyNames(value).forEach(function (key) {
      let found = value[key]
      if (key === 'stack') {
        found = `${found}`.replace(/(\r\n|\n|\r)/gm, '')
      }
      error[key] = found
    })
    return error
  }

  return value
}

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json({replacer: replaceErrors, space: isDev ? 2 : 1})
)

let logger = null

function createLogger (meta = {}) {
  return winston.createLogger({
    format,
    defaultMeta: {
      ...meta
    },
    transports: [
      new winston.transports.Console(),
    ]
  })
}
module.exports.createLogger = createLogger
module.exports.getLogger = (meta = {}) => {
  if (logger) return logger
  return createLogger(meta)
}


