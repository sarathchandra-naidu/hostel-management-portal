// models/Room.js
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      uppercase: true,   // "a101" → "A101"
    },

    floor: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      // Single=1, Double=2, Triple=3, Dormitory=6 (or whatever)
    },

    // How many students are currently in this room
    occupiedCount: {
      type: Number,
      default: 0,
    },

    // Array of student references — who lives here
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],

    amenities: {
      hasAC: { type: Boolean, default: false },
      hasAttachedBath: { type: Boolean, default: false },
      hasWifi: { type: Boolean, default: true },
    },

    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
    },

    status: {
      type: String,
      enum: ['Available', 'Full', 'Maintenance'],
      default: 'Available',
    },
  },
  { timestamps: true }
)

// VIRTUAL FIELD — computed property, not stored in DB
// Like a "calculated column" — available = capacity - occupiedCount
roomSchema.virtual('availableSpots').get(function () {
  return this.capacity - this.occupiedCount
  // we use 'function' not arrow fn because we need 'this'
})

module.exports = mongoose.model('Room', roomSchema)