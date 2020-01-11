const {Router} = require('express')

/** Controllers */
const FollowController = require('../../../controllers/v1/FollowController')

/** Validators */
const followValidator = require('../../../validators/controllers/followValidatior')

/** middleware */
const useTokenAuthenticator = require('../../../middleware/useTokenAuthenticator')

const router = Router()
const followController = new FollowController()

router.use(useTokenAuthenticator)

router.post('/follow', followValidator, followController.update)

module.exports = router
