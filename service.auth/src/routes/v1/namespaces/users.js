const {Router} = require('express')

/** Controllers */
const MultiUserController = require('../../../controllers/v1/MultiUserController')

/** Validators */

/** middleware */
const useTokenAuthenticator = require('../../../middleware/useTokenAuthenticator')

const router = Router()
const multiUserController = new MultiUserController()

router.use(useTokenAuthenticator)

router.post('/', multiUserController.get)

module.exports = router
