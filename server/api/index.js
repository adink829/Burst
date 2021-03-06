const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/sources', require('./sources'))
router.use('/articles', require('./articles'))
router.use('/topics', require('./topics'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
