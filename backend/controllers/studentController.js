
const Student = require('../models/Student')
const Room = require('../models/Room')


const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('room', 'roomNumber floor type')
      
      .sort({ createdAt: -1 })  

    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json(student)
  } catch (error) {
    
    res.status(400).json({ message: error.message })
  }
}


const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('room')

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,     
        runValidators: true,  
      }
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    
    student.isActive = false
    await student.save()

    res.json({ message: 'Student removed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
}