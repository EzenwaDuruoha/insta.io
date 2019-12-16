const {Router} = require('express')

/** Controllers */
const getUserController = require('../../../controllers/v1/getUserController')

/** Validators */
const getUserValidator = require('../../../validators/controllers/getUserValidator')

/** middleware */
const useValidator = require('@middleware/use-validation')
const useTokenAuthenticator = require('../../../middleware/useTokenAuthenticator')

const router = Router()

router.use(useTokenAuthenticator)

router.get('/:id', [getUserValidator, useValidator, getUserController])
router.post('/get', [getUserValidator, useValidator, getUserController])

module.exports = router
