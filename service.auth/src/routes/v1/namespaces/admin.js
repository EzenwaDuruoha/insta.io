const {Router} = require('express')

const router = Router()

function setRoutes (routes) {
  for (const route of routes) {
    const {namespace, router: namespaceRouter} = route
    router.use(namespace, namespaceRouter)
  }
  return router
}

module.exports = setRoutes
