const {Router} = require('express')

/** controllers */
const loginController = require('../../../controllers/v1/loginController')
const registerController = require('../../../controllers/v1/registerController')

/** validators */
const registrationValidator = require('../../../validators/controllers/registrationValidator')
const loginValidator = require('../../../validators/controllers/loginValidator')

/** middleware */
const useValidator = require('@middleware/use-validation')

const router = Router()

router.post('/login', [loginValidator, useValidator, loginController])
router.post('/register', [registrationValidator, useValidator, registerController])

module.exports = router
