// routes/studentRoutes.js
const express = require('express')
const router = express.Router()
const {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController')
const { protect, adminOnly } = require('../middleware/auth')

// protect     → must be logged in
// adminOnly   → must be admin role

router.route('/')
  .get(protect, getStudents)              // any logged-in user
  .post(protect, adminOnly, createStudent) // admin only

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, adminOnly, updateStudent)
  .delete(protect, adminOnly, deleteStudent)

module.exports = router