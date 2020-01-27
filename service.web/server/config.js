const path = require('path')
const {
  NODE_ENV = 'development',
  PORT = 80,
  AUTH_SERVICE = 'http://localhost/auth',
  MEDIA_SERVICE = 'http://localhost/media'
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
  templatesPath: `${appPath}/server/src/templates`,
  network: {
    userServiceUrl: AUTH_SERVICE,
    mediaServiceUrl: MEDIA_SERVICE
  }
}
