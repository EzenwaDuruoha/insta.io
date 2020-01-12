const {Router} = require('express')
// Middleware
const useAuthenticationToken = require('../../../middleware/useAuthenticationToken')

// Controllers
const CommentController = require('../../../controllers/v1/CommentController')

// Validators
const createCommentValidator = require('../../../validation/controllers/comment/createCommentValidator')

const router = Router()
const commentController = new CommentController()

router.use(useAuthenticationToken)

router.get('/:id', commentController.get)
router.post('/create', createCommentValidator, commentController.create)

module.exports = router
