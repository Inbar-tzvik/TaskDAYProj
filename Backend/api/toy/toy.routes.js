const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getToys, getToyById, addToy, updateToy, removeToy, addReview } = require('./toy.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getToys)
router.get('/:id', getToyById)

// these funcs with require authorize :
router.post('/', requireAuth, requireAdmin, addToy)
router.put('/', requireAuth, requireAdmin, updateToy)
router.delete('/:id', requireAuth, requireAdmin, removeToy)

module.exports = router