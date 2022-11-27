const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addGroup, updateGroup, deleteGroup } = require('./group.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.put('/', log, updateGroup)
router.post('/', log, addGroup)

//delete group doesnt work, and should not work. cause we will send "board" from front!
router.delete('/:id', deleteGroup)
    // we need this? getGroups????


// WITH AUTH - to add ===> requireAuth / requireAdmin
// router.post('/', requireAuth, requireAdmin, addGroup)

module.exports = router