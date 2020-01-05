
const express = require('express')
const device = require('express-device')
const cookieParser = require('cookie-parser')
const logger = require('@utils/logger').getLogger({ service: 'Media.Web' })

const useLogger = require('@middleware/uselogger')
const useCors = require('@middleware/usecors')

const config = require('../config')
const router = require('./routes')

const app = express()

app.disable('x-powered-by')
app.use(useLogger(logger))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(useCors())

app.use(device.capture({
  botUserAgentDeviceType: 'phone',
  unknownUserAgentDeviceType: 'phone',
  emptyUserAgentDeviceType: 'phone',
  carUserAgentDeviceType: 'phone',
  consoleUserAgentDeviceType: 'desktop',
  tvUserAgentDeviceType: 'desktop',
  parseUserAgent: true
}))
device.enableDeviceHelpers(app)

app.use('/', router)
app.use(express.static(config.staticPath))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).send('NOT FOUND')
})

// error handler
app.use(function (error, req, res, next) {
  logger.error(error, { tag: '500-handler' })
  res.status(500).json('Internal Server Error')
})

module.exports = app
