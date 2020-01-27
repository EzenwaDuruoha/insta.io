const setupReloader = (hooks) => {
    const { config, context } = hooks.getFrame()
    const res = hooks.getResponse()
    if (!config.isDev()) return
    const extend = {
      core: {},
      context: {...context}
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
    extend.context.index = webpackStats.outputPath + '/index.html'
    hooks.setFrame(extend)
}
module.exports = setupReloader
