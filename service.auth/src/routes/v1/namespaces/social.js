const {Router} = require('express')

/** Controllers */
const FollowController = require('../../../controllers/v1/FollowController')

/** Validators */
const followValidator = require('../../../validators/controllers/followValidator')
const idValidator = require('../../../validators/controllers/idValidator')

/** middleware */

const router = Router()
const followController = new FollowController()

router.post('/:action(follow|unfollow)', followValidator, followController.update)
router.post('/stats/:stat(following|followers)', idValidator, followController.follows)

module.exports = router
