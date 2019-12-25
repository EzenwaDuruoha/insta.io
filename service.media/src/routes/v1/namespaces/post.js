const {Router} = require('express')
// Middleware
const useValidation = require('../../../middleware/useValidator')
// Controllers
const createController = require('../../../controllers/v1/posts/createPostController')
const getPostController = require('../../../controllers/v1/posts/getPostController')
// Validators
const createValidator = require('../../../validation/controllers/post/createValidator')

const router = Router()

router.get('/:id', getPostController)
router.post('/create', [createValidator, useValidation, createController])

module.exports = router
