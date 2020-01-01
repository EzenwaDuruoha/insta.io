const EventEmitter = require('events')
const {bindMethodsToSelf} = require('../helpers/objectHelper')

class Queue extends EventEmitter {
  constructor () {
    super()
    this.currentTimer = null
    this.tasksCount = 0
    this.tasks = []
    this.results = []
    bindMethodsToSelf.bind(this)(Queue)
  }

  /**
   *
   * @param {Function} callback
   * @param {Number} delay
   */
  add (callback, meta = {}, delay = 0) {
    this.tasks.push({callback, delay, meta, position:this.tasksCount + 1})
    this.tasksCount++
    if (this.currentTimer) return
    this.next()
  }

  next () {
    if (this.currentTimer) return
    const task = this.tasks.shift()
    if (!task) {
      this.emit('complete')
      return this.clear()
    }
    this.emit('run', {meta: task.meta, position: task.position})
    this.currentTimer = setTimeout(async () => {
      try {
        const result = await task.callback.call()
        this.emit('result', {meta: task.meta, position: task.position, result})
        this.results.push({result, ...task})
      } catch (error) {
        this.emit('error', error, {meta: task.meta, position: task.position})
      }
      this.currentTimer = null
      this.next()
    }, task.delay)
  }

  clear () {
    if (this.currentTimer) clearTimeout(this.currentTimer)
    this.currentTimer = null
    this.tasks = []
    this.tasksCount = 0
  }

  clearResults () {
    this.results = []
  }
}
module.exports = Queue
