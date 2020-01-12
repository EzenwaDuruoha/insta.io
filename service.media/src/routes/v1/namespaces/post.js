const {Router} = require('express')
const PostController = require('../../../controllers/v1/PostController')

// Middleware
const useAuthenticationToken = require('../../../middleware/useAuthenticationToken')

// Validators
const createValidator = require('../../../validation/controllers/post/createValidator')
const postQueryValidator = require('../../../validation/controllers/post/postQueryValidator')

const router = Router()
const postController = new PostController()

router.use(useAuthenticationToken)

router.post('/create', createValidator, postController.create)
router.post('/query', postQueryValidator, postController.query)
router.get('/:id', postController.get)

module.exports = router
