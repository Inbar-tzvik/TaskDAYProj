const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoardById, addBoard, updateBoard, removeBoard, addReview } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:id', getBoardById)

// TODO AFTER ALL WORKS! - these funcs with require authorize - should be on board!:
// router.post('/', requireAuth, requireAdmin, addBoard)
// router.put('/', requireAuth, requireAdmin, updateBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)
// OPTIONAL - router.post('/send',  log, sendMail)

//FOR CHECKING ONLY WITHOUT AUTH!!
router.post('/', addBoard)
router.put('/', updateBoard)
router.delete('/:id', removeBoard)


module.exports = router