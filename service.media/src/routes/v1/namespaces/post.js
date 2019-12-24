const {Router} = require('express')

const router = Router()

router.get('/:id', (req, res) => {
  res.status(200).json({status: 'success'})
})

module.exports = router
