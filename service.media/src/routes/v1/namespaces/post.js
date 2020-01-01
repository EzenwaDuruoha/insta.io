const {Router} = require('express')
const PostController = require('../../../controllers/v1/posts')

const router = Router()
const postController = new PostController()

router.post('/create', postController.create)
router.post('/query', postController.query)
router.get('/:id', postController.get)

module.exports = router
