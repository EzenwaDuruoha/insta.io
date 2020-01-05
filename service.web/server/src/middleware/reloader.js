/**
 * @param {*} app - Express app or router
 */
function reloader(app) {
    const webpack = require('webpack')
    const devMiddleWare = require('webpack-dev-middleware')
    const hma = require('webpack-hot-middleware')
    const configFactory = require('../../../config/webpack.config')

    const webpackConfig = configFactory('development')
    const compiler = webpack(webpackConfig)

    app.use(devMiddleWare(compiler, {
        serverSideRender: true,
        publicPath: webpackConfig.output.publicPath,
        index: '/',
        quiet: true,
        watchOptions: {
          ignored: /node_modules/
        }
      }))

    app.use(hma(compiler))
}

module.exports = reloader