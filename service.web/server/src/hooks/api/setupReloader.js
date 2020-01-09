const setupReloader = (hooks) => {
    const { config } = hooks.getFrame()
    const res = hooks.getResponse()
    console.log('RELOADER', config.isDev())
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
    extend.context.index = webpackStats.outputPath + '/index.html'
    hooks.setFrame(extend)
}
module.exports = setupReloader
