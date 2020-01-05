const uuid = require('uuid/v4')
const config = require('../../../config')
const logger = require('@utils/logger').getLogger({service: 'Media.Web'})
const Queue = require('../common/queue')
/**
 *
 * @typedef {import('express').request} Request
 * @typedef {import('express').response} Responsee
 */

/**
 * Request Frame.
 * @typedef {Object} Frame
 * @property {Function} logger
 * @property {uuid} requestId
 * @property {Request} request
 */

/**
 * ApiBuilder
 * @module ApiBuilder
 * @function
 * @param {Request} req
 * @param {Responsee} res
 * @param {Function} next
 */
const apiBuilder = function (req, res, next) {
  const requestId = uuid()
  const queue = new Queue()
  const instance = {}
  let complete = false
  let frame = {
    config,
    logger,
    requestId,
    core: {},
    context: {},
    request: req,
    body: req.body,
    file: req.file,
    files: req.files,
    query: req.query,
    params: req.params
  }
  const isComplete = () => complete
  const setComplete = (bool) => (complete = bool)
  /**
   *
   * @param {Frame} o
   * @returns {Frame}
   */
  const newFrame = (o) => (frame = Object.assign(frame, o))
  const getFrame = () => frame

  queue.on('error', (err, args) => logger.error(err, {tag: 'BUILDER_TASK_QUEUE_ERROR', ...args, requestId}))
  queue.on('run', (payload) => logger.info('Queue Operation: RUN', {...payload, requestId}))
  queue.on('result', (payload) => logger.info('Queue Operation: RESULT', {...payload, requestId}))
  /**
   * @typedef ResponseObject
   * @property {String} status
   * @property {Number} code
   * @property {any} data
   * @property {any} message
   * @property {String} status
   */
  /**
   * @param {ResponseObject | Error} payload
   */
  instance.complete = (payload) => {
    queue.clear()
    if (payload instanceof Error) {
      setComplete(true)
      next(payload)
    } else {
      res.status(200).send(payload)
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
   * @param {Frame} options
   */
  instance.setFrame = (options) => {
    if (typeof options === 'object') {
      queue.add(() => {
        newFrame(options)
      }, {name: 'setFrame'})
    }
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
          result = await fn(getFrame())
        } catch (error) {
          logger.error(error, {tag: 'BUILDER_RUN_CONTROLLER', requestId})
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
  /**
 * This callback is displayed as part of the Requester class.
 * @callback CustomRunner
 * @param {instance} instance
 * @param {Frame} requestFrame
 * @param {Object} hooks
 */
  /**
   * @param {CustomRunner} fn
   */
  instance.runCustom = (fn) => {
    if (typeof fn !== 'function') return instance
    const task = async () => {
      try {
        return await fn(instance, getFrame(), {
          isComplete,
          setComplete,
          newFrame,
          getFrame
        }, res)
      } catch (error) {
        logger.error(error, {tag: 'BUILDER_RUN_CUSTOM', requestId})
        instance.complete(error)
      }
    }
    queue.add(task, {name: 'runCustom'})
    return instance
  }

  return instance
}

module.exports = apiBuilder
