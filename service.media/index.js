const http = require('http')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const config = require('./config')

const closers = []
let exiting = false

process.stdin.resume()

function exitHandler (options, exitCode) {
  if (options.cleanup) { /** perform synchronous cleanup actions */ }
  if (exitCode) {
    if (exitCode instanceof Error) {
      const meta = {tag: 'app-index', uncaughtException: false, unhandledRejection: false}
      if (options.uncaught) meta.uncaughtException = true
      if (options.unhandled) meta.unhandledRejection = true
      logger.error(exitCode, meta)
    }
  }

  if (options.exit) {
    if (exiting) return
    exiting = true
    logger.info('Media.Service Exit', {exitCode: (exitCode instanceof Error) ? 'ERROR' : exitCode, tag: 'app-index'})
    try {
      closers.forEach((fn) => {
        if (typeof fn === 'function') {
          fn()
        }
      })
    } catch (error) {
      logger.error(error, {tag: 'exitHandler'})
    }
    process.exit(0)
  }
}
/**
 * sets a global exit function that can be used anywhere
 */
global.exit = function () {
  exitHandler({exit: true}, 'SYSTEM')
}

process.on('exit', exitHandler.bind(null, {cleanup: true}))
process.on('SIGINT', exitHandler.bind(null, {exit: true}))
process.on('SIGTERM', exitHandler.bind(null, {exit: true}))
process.on('SIGHUP', exitHandler.bind(null, {exit: true}))
process.on('SIGUSR1', exitHandler.bind(null, {exit: true}))
process.on('SIGUSR2', exitHandler.bind(null, {exit: true}))
process.on('uncaughtException', exitHandler.bind(null, {exit: true, uncaught: true}))
process.on('unhandledRejection', exitHandler.bind(null, {exit: false, unhandled: true}))

logger.info('Media.Service Initialization..', {...config, tag: 'app-index'})

const {app} = require('./src/app')
const core = require('./src/core')

app.set('port', config.port)

const server = http.createServer(app)
core.init()
  .then((success) => {
    if (!success) global.exit()
    logger.info('Required Services Initialized', {tag: 'app-index', stats: success})
    server.listen(config.port, async (err) => {
      if (err) {
        logger.error(err, {tag: 'app-index'})
        global.exit()
        return
      }
      core.setupCloseHandlers(closers)
      logger.info('Server Started Successfully', {port: config.port, tag: 'app-index'})
    })
  })
