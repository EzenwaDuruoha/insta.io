const {Router} = require('express')

const main = require('./namespaces/main')

const router = Router()

router.use('/', main)

module.exports = router
