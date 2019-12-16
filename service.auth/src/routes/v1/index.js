const {Router} = require('express')

const auth = require('./namespaces/auth')
const user = require('./namespaces/user')
const docs = require('./namespaces/docs')

const router = Router()

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.use('/auth', auth)
router.use('/user', user)
router.use('/docs', docs)

module.exports = router
