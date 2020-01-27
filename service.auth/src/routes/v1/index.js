const {Router} = require('express')

const admin = require('./namespaces/admin')
const auth = require('./namespaces/auth')
const social = require('./namespaces/social')
const user = require('./namespaces/user')
const users = require('./namespaces/users')

const useTokenAuthenticator = require('../../middleware/useTokenAuthenticator')

const router = Router()

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.use('/admin', admin([
  {namespace: '/social', router: social}
]))
router.use('/auth', auth)
router.use('/social', useTokenAuthenticator, social)
router.use('/user', useTokenAuthenticator, user)
router.use('/users', useTokenAuthenticator, users)

module.exports = router
