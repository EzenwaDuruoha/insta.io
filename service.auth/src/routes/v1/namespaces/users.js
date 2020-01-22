const {Router} = require('express')

/** Controllers */
const MultiUserController = require('../../../controllers/v1/MultiUserController')

/** Validators */

/** middleware */

const router = Router()
const multiUserController = new MultiUserController()

router.post('/', multiUserController.get)

module.exports = router
