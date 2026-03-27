const express = require('express')
const router = express.Router()
const {
  getFees, createFee, markFeePaid, getFeeSummary
} = require('../controllers/feeController')
const { protect, adminOnly } = require('../middleware/auth')

router.route('/')
  .get(protect, getFees)
  .post(protect, adminOnly, createFee)

router.get('/summary',         protect, getFeeSummary)
router.put('/:id/pay',         protect, adminOnly, markFeePaid)

module.exports = router