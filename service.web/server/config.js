const path = require('path')
const {
  NODE_ENV = 'development',
  PORT = 80
} = process.env

process.env.NODE_ENV = NODE_ENV
const appPath = path.resolve(__dirname, '..')
const serverPath = __dirname
const isDev = () => NODE_ENV === 'development'
const isProd = () => NODE_ENV === 'production'

module.exports = {
  env: NODE_ENV,
  port: PORT,
  appPath,
  serverPath,
  isDev,
  isProd,
  staticPath: isDev() ? `${appPath}/public` : `${appPath}/build`,
}
