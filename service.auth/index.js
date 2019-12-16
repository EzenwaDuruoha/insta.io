const http = require('http')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})
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

const {app, extend} = require('./src/app')
const DatabaseService = require('./src/database')
const JWTService = require('./src/services/jwtService')
const RedisService = require('@services/redis')
const MQService = require('@services/rabbitmq')
const databaseConfig = require('./src/database/connection')

app.set('port', config.port)

const server = http.createServer(app)
const dbService = new DatabaseService()
const jwtService = new JWTService(config.jwt, config.secret, '30d')
const redisService = new RedisService()
const mqService = new MQService(config.rabbitmq, logger, {tag: 'MQ_SERVICE'})

extend(function () {
  return {
    dbService,
    jwtService,
    redisService,
    mqService,
    config
  }
})

mqService.on('message', (data) => {
  logger.info('MQ Message Dispatch', {env: config.env})
})

Promise.all([
  dbService.init(databaseConfig),
  redisService.init(config.redis, config.isRedisCluster),
  mqService.init()
])
  .then((success) => {
    logger.info('Required Services Initialized', {tag: 'app-index', stats: success})
    server.listen(config.port, async (err) => {
      if (err) {
        logger.error(err, {tag: 'app-index'})
        global.exit()
        return
      }
      closers.push(mqService.close)
      logger.info('Server Started Successfully', {port: config.port, tag: 'app-index'})
    })
  })
  .catch(err => {
    logger.error(err, {tag: 'app-index'})
    global.exit()
  })
