const express = require('express')
const config = require('../config')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})

const useLogger = require('@middleware/uselogger')
const useCors = require('@middleware/usecors')
const v1 = require('./routes/v1')

const app = express()
const dependencies = []

// app setup
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.locals.user = null
  res.locals.token = null
  res.locals.isAuthenticated = false
  dependencies.forEach((fn) => {
    const r = fn(req, res)
    if (r && typeof r === 'object') {
      res.locals = {...res.locals, ...r}
    }
  })
  next()
})
app.use(useLogger(logger))
app.use(express.urlencoded({extended: false}))
app.use(express.json({extended:true}))
app.use(useCors(['http://localhost:8000']))

app.all('/', (req, res) => res.status(200).json({status: 'ping'}))
app.use('/api/v1', v1)

// Handling 404
app.use(function (req, res) {
  res.status(404).json({
    status: 'error',
    message: 'Route does not exist'
  })
})

// Handling 500
app.use(function (error, req, res, next) { //eslint-disable-line
  const payload = {
    status: 'error',
    message: 'An Internal Error Occurred'
  }
  if (config.isDev() && (error instanceof Error)) {
    payload.data = `Operation Error: ${error.message}`
    payload.stack = error.stack.split('\n')
  }
  logger.error(error, {tag: '500-handler'})
  res.status(500).json(payload)
})

module.exports = {
  app,
  /**
   * @param {function} fn
   */
  extend: (fn) => {
    if (typeof fn === 'function') dependencies.push(fn)
  }
}
