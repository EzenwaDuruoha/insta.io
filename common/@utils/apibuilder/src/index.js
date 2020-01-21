'use strict'

const Queue = require('./utils/queue')
const EventEmitter = require('events').EventEmitter
const mixin = require('merge-descriptors')

const EVENT_ERROR = 'error'
const EVENT_RESULT = 'result'
const EVENT_RUN = 'run'

function createBuilder (frameOptions = {}, contextOpions = {}, propsOptions = {}) {
  const builder = function (req, res, next) {
    const queue = new Queue()
    let context = {...contextOpions}
    let props = {...propsOptions}
    let complete = false
    let frame = {
      dependencies: {},
      context: {},
      request: req,
      body: req.body,
      file: req.file,
      files: req.files,
      query: req.query,
      params: req.params,
      ...frameOptions
    }

    const hooks = {
      isComplete: () => complete,
      setComplete: (bool) => (complete = bool),
      setFrame: (o) => (frame = Object.assign(frame, o)),
      getFrame: () => frame,
      getContext: () => context,
      getProps: () => props,
      setProps: (o) => (props = Object.assign(props, o)),
      getQueue: () => queue,
      getRequest: () => req,
      getResponse: () => res
    }
    const queueEventHandler = (state, error, args = {}) => {
      const e = error instanceof Error ? {error} : error
      builder.emit('queue', Object.assign({state}, args, e))
    }

    queue.on(EVENT_ERROR, queueEventHandler.bind(this, EVENT_ERROR))
    queue.on(EVENT_RESULT, queueEventHandler.bind(this, EVENT_RESULT))
    queue.on(EVENT_RUN, queueEventHandler.bind(this, EVENT_RUN))

    context.complete = (payload) => {
      queue.clear()
      if (payload instanceof Error) {
        hooks.setComplete(true)
        next(payload)
      } else {
        res.status(200).send(payload)
      }
    }

    context.addDependency = (dependency) => {
      if (typeof dependency === 'object') {
        queue.add(() => {
          frame.dependencies = Object.assign(frame.dependencies, dependency)
        }, {name: 'addDependency'})
      }
      return context
    }

    context.setFrame = (options) => {
      if (typeof options === 'object') {
        queue.add(() => {
          hooks.setFrame(options)
        }, {name: 'setFrame'})
      }
      return context
    }
    // {if: [{'option.value.inner': 'some value'}]}
    context.runController = (fn, options = {}) => {
      const defaults = Object.assign({if: null}, options)
      if (hooks.isComplete()) return context
      if (typeof fn === 'function') {
        const task = async () => {
          if (hooks.isComplete()) return
          let result = null
          try {
            result = await fn(hooks.getFrame())
          } catch (error) {
            builder.emit('error', error)
            result = error
          }
          context.complete(result)
        }
        queue.add(task, {name: 'runController'})
      } else {
        context.complete(new Error('Controller Not Set'))
      }
      return context
    }

    context.runCustom = (fn) => {
      if (typeof fn !== 'function') return context
      const task = async () => {
        try {
          return await fn(hooks, res)
        } catch (error) {
          builder.emit('error', error)
          context.complete(error)
        }
      }
      queue.add(task, {name: 'runCustom'})
      return context
    }

    const [c, p] = builder.init(context, props, hooks)
    context = c
    props = p
    return context
  }

  builder.methods = {}
  builder.props = {}

  builder.init = function (context, props = {}, hooks = {}) {
    const s = Object.assign(props, this.props)
    const buildContext = Object.keys(this.methods).reduce((reducer, name) => {
      reducer[name] = this.methods[name](hooks)
      return reducer
    }, {})
    const c = Object.assign(context, buildContext)
    return [c, s]
  }

  builder.addListener = function (event, fn) {
    if (typeof fn === 'function' && typeof event === 'string') {
      this.on(event, fn)
    }
  }

  builder.defineStaticMethod = function (name, fn) {
    if (typeof fn !== 'function') return
    name = typeof name !== 'string' ? JSON.stringify(name) : name
    this.methods[name] = fn
  }

  builder.defineStaticProperty = function (name, value, options = {}) {
    const defaults = Object.assign({merge: false}, options)
    name = typeof name !== 'string' ? JSON.stringify(name) : name
    if (typeof value === 'object' && defaults.merge && typeof this.props[name] === 'object') {
      this.props[name] = Object.assign(this.props[name], value)
      return
    }
    this.props[name] = value
  }

  mixin(builder, EventEmitter.prototype, false)

  return builder
}
module.exports = createBuilder
