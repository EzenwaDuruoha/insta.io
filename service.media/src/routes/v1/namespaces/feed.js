const {Router} = require('express')
// Middleware
const useAuthenticationToken = require('../../../middleware/useAuthenticationToken')

// Controllers
const FeedController = require('../../../controllers/v1/FeedController')

// Validators

const router = Router()
const feedController = new FeedController()

router.use(useAuthenticationToken)

router.get('/', feedController.get)

module.exports = router
