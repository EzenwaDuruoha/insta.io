const {Router} = require('express')

/** Controllers */
const getUserController = require('../../../controllers/v1/getUserController')
const getSessionUserController = require('../../../controllers/v1/getSessionUserController')

/** Validators */
const getUserValidator = require('../../../validators/controllers/getUserValidator')

/** middleware */
const useValidator = require('../../../middleware/useValidator')
const useTokenAuthenticator = require('../../../middleware/useTokenAuthenticator')

const router = Router()

router.use(useTokenAuthenticator)

router.get('/', getSessionUserController)
router.get('/:id', [getUserValidator, useValidator, getUserController])
router.post('/get', [getUserValidator, useValidator, getUserController])

module.exports = router
