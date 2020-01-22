const BaseHTTPService = require('./BaseHTTPService')

class WorkerDispatcher extends BaseHTTPService {
  /**
   *
   * @param {String} task
   * @param {*} args
   */
  dispatch (task = '', ...args) {
    return this.post(`/api/task/async-apply/${task}`, {
      args: args
    })
  }
}
module.exports = WorkerDispatcher
