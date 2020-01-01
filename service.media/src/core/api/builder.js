const {getServices} = require('../')
const {pipeline} = require('../api/pipeline')
const config = require('../../../config')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const Queue = require('../../utils/queue')
const Response = require('../utils/response')

const apiBuilder = function (req, res, next) {
  const queue = new Queue()
  const instance = {}
  let complete = false
  let pipelineOptions = {
    authenticator: 'skip',
    permission: 'skip',
  }
  let frame = {
    config,
    logger,
    context: {
      user: null,
      token: null,
      tokenData: null,
      isAuthenticated: false,
    },
    request: req,
    body: req.body,
    file: req.file,
    files: req.files,
    query: req.query,
    params: req.params,
    core: getServices()
  }
  const isComplete = () => complete
  const setComplete = (bool) => (complete = bool)
  const newFrame = (o) => (frame = Object.assign(frame, o))
  queue.on('error', (err, args) => logger.error(err, {tag: 'BUILDER_TASK_QUEUE_ERROR', ...args}))
  queue.on('run', (payload) => logger.info('Queue Operation: RUN', payload))
  queue.on('result', (payload) => logger.info('Queue Operation: RESULT', payload))

  /**
   * @param {Object | Error} payload
   */
  instance.complete = (payload) => {
    queue.clear()
    if (payload instanceof Error) {
      setComplete(true)
      next(payload)
    } else {
      res.send((new Response(res, payload)).toJson())
    }
  }

  /**
   * @param {Object} dependency
   */
  instance.addDependency = (dependency) => {
    if (typeof dependency === 'object') {
      queue.add(() => {
        frame.core = Object.assign(frame.core, dependency)
      }, {name: 'addDependency'})
    }
    return instance
  }

  /**
   * @param {Object} options
   */
  instance.setPipeline = (options) => {
    if (typeof options === 'object') {
      queue.add(async () => {
        pipelineOptions = Object.assign(pipelineOptions, options)
      }, {name: 'setPipeline'})
    }
    return instance
  }

  /**
   * @param {Object} options
   */
  instance.setFrameContext = (options) => {
    if (typeof options === 'object') {
      queue.add(() => {
        newFrame({context: options})
      }, {name: 'setFrameContext'})
    }
    return instance
  }

  /**
   * @param {Object} options
   */
  instance.setFrame = (options) => {
    if (typeof options === 'object') {
      queue.add(() => {
        newFrame(options)
      }, {name: 'setFrame'})
    }
    return instance
  }

  instance.runPipeline = () => {
    if (isComplete()) return instance
    const task = async () => {
      if (isComplete()) return
      try {
        const extended = await pipeline(frame, pipelineOptions)
        if (!extended) {
          instance.complete(new Error('No Result From Pipeline'))
          return
        }
        newFrame(extended)
      } catch (error) {
        logger.error(error, {tag: 'BUILDER_RUN_PIPELINE'})
        instance.complete(new Error('Pipeline Failed'))
      }
    }
    queue.add(task, {name: 'runPipeline'})
    return instance
  }

  /**
   * @param {Function} fn
   */
  instance.runController = (fn) => {
    if (isComplete()) return instance
    if (typeof fn === 'function') {
      const task = async () => {
        if (isComplete()) return
        let result = null
        try {
          result = await fn(frame)
        } catch (error) {
          logger.error(error, {tag: 'BUILDER_RUN_CONTROLLER'})
          result = error
        }
        instance.complete(result)
      }
      queue.add(task, {name: 'runController'})
    } else {
      instance.complete(new Error('Controller Not Set'))
    }
    return instance
  }

  return instance
}

module.exports = apiBuilder
