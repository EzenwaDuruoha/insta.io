const {Router} = require('express')
const swaggerUi = require('swagger-ui-express')
const specs = require('../../../docs/swagger.json')

console.log(specs)

const router = Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(specs))

module.exports = router
