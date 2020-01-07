const {Router} = require('express')

/** Controllers */
const UserController = require('../../../controllers/v1/UserController')

/** Validators */
const getUserValidator = require('../../../validators/controllers/getUserValidator')

/** middleware */
const useTokenAuthenticator = require('../../../middleware/useTokenAuthenticator')

const router = Router()
const userController = new UserController()

router.use(useTokenAuthenticator)

router.get('/', userController.session)
router.get('/:id', getUserValidator, userController.get)
router.post('/get', getUserValidator, userController.get)

module.exports = router
