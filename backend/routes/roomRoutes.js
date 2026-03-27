const express = require('express')
const router = express.Router()
const {
  getRooms, createRoom, assignRoom, unassignRoom, getRoomById
} = require('../controllers/roomController')
const { protect, adminOnly } = require('../middleware/auth')

router.route('/')
  .get(protect, getRooms)
  .post(protect, adminOnly, createRoom)

router.get('/:id',               protect, getRoomById)
router.post('/assign',           protect, adminOnly, assignRoom)
router.post('/unassign',         protect, adminOnly, unassignRoom)

module.exports = router