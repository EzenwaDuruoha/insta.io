const {Router} = require('express')
const AuthController = require('../../../controllers/v1/AuthController')

/** validators */
const registrationValidator = require('../../../validators/controllers/registrationValidator')
const loginValidator = require('../../../validators/controllers/loginValidator')

const controller = new AuthController()
const router = Router()

router.post('/login', loginValidator, controller.login)
router.post('/register', registrationValidator, controller.register)

module.exports = router
