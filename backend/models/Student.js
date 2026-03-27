// models/Student.js
// PURPOSE: Defines what a "Student" looks like in our database
// Think of this as the "form" every student must fill

const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'Student name is required'],  // [rule, error message]
      trim: true,        // removes extra spaces: "  John  " → "John"
      minlength: [2, 'Name must be at least 2 characters'],
    },

    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,      // no two students can have same roll number
      uppercase: true,   // auto-converts to uppercase: "cs101" → "CS101"
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,   // auto-converts to lowercase
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      // ↑ regex validates email format — common interview topic!
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Phone must be 10 digits'],
    },

    course: {
      type: String,
      required: [true, 'Course is required'],
      enum: ['B.Tech', 'M.Tech', 'MBA', 'BCA', 'MCA', 'B.Sc', 'M.Sc'],
      // ↑ enum = only these values allowed. Rejects anything else!
    },

    year: {
      type: Number,
      required: true,
      min: [1, 'Year must be at least 1'],
      max: [5, 'Year cannot exceed 5'],
    },

    // Reference to Room — this links Student ↔ Room
    // Like a "foreign key" in SQL
    room: {
      type: mongoose.Schema.Types.ObjectId,  // stores Room's _id
      ref: 'Room',                            // tells Mongoose which model
      default: null,                          // null = not assigned yet
    },

    feeStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending',   // every new student starts with Pending
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
    },

    photo: {
      type: String,       // we'll store image URL, not the image itself
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,      // true = currently living in hostel
    },
  },
  {
    // Second argument to Schema — options
    timestamps: true,
    // ↑ Automatically adds:
    //   createdAt — when student was registered
    //   updatedAt — when record was last changed
    // You don't have to manage these manually!
  }
)

// Export the model
// 'Student' → MongoDB will create a collection called 'students' (auto-lowercase + plural)
module.exports = mongoose.model('Student', studentSchema)