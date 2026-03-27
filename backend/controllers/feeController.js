const Fee = require('../models/Fee')
const Student = require('../models/Student')

const getFees = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status)    filter.status    = req.query.status
    if (req.query.studentId) filter.student   = req.query.studentId

    const fees = await Fee.find(filter)
      .populate('student', 'name rollNumber')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 })

    res.json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body)

    
    await Student.findByIdAndUpdate(req.body.student, {
      feeStatus: req.body.status || 'Pending',
    })

    res.status(201).json(fee)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


const markFeePaid = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' })
    }

    fee.status      = 'Paid'
    fee.paidAmount  = fee.amount
    fee.paymentDate = Date.now()
    fee.paymentMethod = req.body.paymentMethod || 'Cash'
    await fee.save()

    
    await Student.findByIdAndUpdate(fee.student, { feeStatus: 'Paid' })

    res.json({ message: 'Fee marked as paid', fee })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const getFeeSummary = async (req, res) => {
  try {
    
    const summary = await Fee.aggregate([
      {
        $group: {
          _id: '$status',         
          count: { $sum: 1 },     
          total: { $sum: '$amount' }, 
        },
      },
    ])
    

    res.json(summary)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getFees, createFee, markFeePaid, getFeeSummary }