const {Router} = require('express')
// Middleware
const useValidation = require('../../../middleware/useValidator')
const useHydrateUserContext = require('../../../middleware/useHydrateUserContext')
// Controllers
const createController = require('../../../controllers/v1/posts/createPostController')
const getPostController = require('../../../controllers/v1/posts/getPostController')
const getPostByQueryController = require('../../../controllers/v1/posts/getPostsByQueryController')
// Validators
const createValidator = require('../../../validation/controllers/post/createValidator')
const postQueryValidator = require('../../../validation/controllers/post/postQueryValidator')

const router = Router()

router.use(useHydrateUserContext)
router.get('/:id', getPostController)
router.post('/create', [createValidator, useValidation, createController])
router.post('/query', [postQueryValidator, useValidation, getPostByQueryController])

module.exports = router
