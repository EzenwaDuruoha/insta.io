const {Router} = require('express')

const auth = require('./namespaces/auth')
const docs = require('./namespaces/docs')
const social = require('./namespaces/social')
const user = require('./namespaces/user')
const users = require('./namespaces/users')

const router = Router()

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.use('/auth', auth)
router.use('/docs', docs)
router.use('/social', social)
router.use('/user', user)
router.use('/users', users)

module.exports = router
