const {Router} = require('express')

const post = require('./namespaces/post')
const comment = require('./namespaces/comment')
const feed = require('./namespaces/feed')

const router = Router()

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store')
  res.setHeader('Accept', 'application/json')
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.use('/post', post)
router.use('/comment', comment)
router.use('/feed', feed)

module.exports = router
