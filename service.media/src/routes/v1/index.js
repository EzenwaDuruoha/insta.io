const {Router} = require('express')

const post = require('./namespaces/post')

const router = Router()

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.use('/post', post)

module.exports = router
