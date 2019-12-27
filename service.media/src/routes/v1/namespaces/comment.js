const {Router} = require('express')
// Middleware
const useValidation = require('../../../middleware/useValidator')
// Controllers
const createCommentController = require('../../../controllers/v1/comments/createCommentController')
const getCommentsController = require('../../../controllers/v1/comments/getCommentsController')
// Validators
const createCommentValidator = require('../../../validation/controllers/comment/createCommentValidator')

const router = Router()

router.get('/:id', getCommentsController)
router.post('/create', [createCommentValidator, useValidation, createCommentController])

module.exports = router
