const {Router} = require('express')
const config = require('../../../config')
const reloader = require('../../middleware/reloader')
const ClientController = require('../../controllers/client')

const router = Router()
const clientController = new ClientController()

if (config.isDev()) reloader(router)

router.get(/^((?!\.).)*$/, clientController.get)

module.exports = router
