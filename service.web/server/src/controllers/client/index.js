const apiBuilder = require('../../util/http/apiBuilder')
const get = require('./actions/get')

const setupReloader = (self, frame, hooks, res) => {
  const { config } = frame
  if (!config.isDev()) return
  const extend = {
    core: {},
    context: {}
  }
  const webpackStats = res.locals.webpackStats.toJson()

  extend.core.reader = (filename) => {
    return new Promise((resolve, reject) => {
      res.locals.fs.readFile(filename, (err, buff) => {
        if (err) return reject(err)
        return resolve(buff)
      })
    })
  }
  extend.context.templatePath = webpackStats.outputPath + '/index.html'
  hooks.newFrame(extend)
}

const setupSourceRequest = (self, frame, hooks) => {
  const {config, request} = frame
  const { type, name = '', parser: { useragent } } = request.device
  const sourceRequest = {
    useragent,
    env: config.env,
    device: type,
    deviceName: name
  }
  hooks.newFrame({context: {sourceRequest}})
}

class ClientController {
  get(req, res, next) {
    return apiBuilder(req, res, next)
      .runCustom(setupSourceRequest)
      .runCustom(setupReloader)
      .runController(get)
  }
}
module.exports = ClientController
