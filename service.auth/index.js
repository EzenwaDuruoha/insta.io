const http = require('http')
const {nerdvision} = require('@nerdvision/agent')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})
const config = require('./config')

// eslint-disable-next-line max-len
nerdvision.init('770fcf20df63e8eb70586e94af36a90d83efb7ffc8323012aee35189f29d7a5ea9633f315b3c01b48c6a8a8555d3b57b9be324f94a2d736b3181d78e50a4ecbf')
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
    logger.info('AGG-Auth Exit', {exitCode: (exitCode instanceof Error) ? 'ERROR' : exitCode, tag: 'app-index'})
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

logger.info('Starting Agg-Auth Initialization..', {...config, tag: 'app-index'})

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
      closers.push(nerdvision.close.bind(nerdvision))
      logger.info('Server Started Successfully', {port: config.port, tag: 'app-index'})
    })
  })
