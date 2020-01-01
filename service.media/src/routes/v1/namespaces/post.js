const {Router} = require('express')
const PostController = require('../../../controllers/v1/posts')

// Validators
const createValidator = require('../../../validation/controllers/post/createValidator')

const router = Router()
const postController = new PostController()

router.post('/create', createValidator, postController.create)
router.post('/query', postController.query)
router.get('/:id', postController.get)

module.exports = router
