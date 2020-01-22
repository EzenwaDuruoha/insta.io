const {Router} = require('express')

/** Controllers */
const UserController = require('../../../controllers/v1/UserController')

/** Validators */
const getUserValidator = require('../../../validators/controllers/getUserValidator')
const updateUserValidator = require('../../../validators/controllers/updateUserValidator')

/** middleware */

const router = Router()
const userController = new UserController()

router.get('/', userController.session)
router.post('/', getUserValidator, userController.get)
router.put('/', updateUserValidator, userController.update)
router.get('/:id', getUserValidator, userController.get)

module.exports = router
