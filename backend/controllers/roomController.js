
const Room = require('../models/Room')
const Student = require('../models/Student')


const getRooms = async (req, res) => {
  try {
    
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.type)   filter.type   = req.query.type

    const rooms = await Room.find(filter)
      .populate('students', 'name rollNumber')
      
      .sort({ roomNumber: 1 })

    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body)
    res.status(201).json(room)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


const assignRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body

    const room = await Room.findById(roomId)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

   
    if (room.occupiedCount >= room.capacity) {
      return res.status(400).json({ message: 'Room is already full' })
    }

    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

   
    if (student.room) {
      return res.status(400).json({
        message: 'Student is already assigned to a room. Remove first.',
      })
    }

    
    student.room = roomId
    await student.save()

    
    room.students.push(studentId)
    room.occupiedCount += 1

    
    if (room.occupiedCount >= room.capacity) {
      room.status = 'Full'
    }

    await room.save()

    
    const updatedStudent = await Student.findById(studentId).populate('room')
    res.status(200).json({
      message: 'Room assigned successfully',
      student: updatedStudent,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const unassignRoom = async (req, res) => {
  try {
    const { studentId } = req.body

    const student = await Student.findById(studentId)
    if (!student || !student.room) {
      return res.status(400).json({ message: 'Student has no room assigned' })
    }

    const room = await Room.findById(student.room)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    
    room.students = room.students.filter(
      (id) => id.toString() !== studentId
    )
    room.occupiedCount -= 1

    
    if (room.status === 'Full' && room.occupiedCount < room.capacity) {
      room.status = 'Available'
    }

    await room.save()

    
    student.room = null
    await student.save()

    res.json({ message: 'Room unassigned successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('students', 'name rollNumber email feeStatus')

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }
    res.json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getRooms, createRoom, assignRoom, unassignRoom, getRoomById }