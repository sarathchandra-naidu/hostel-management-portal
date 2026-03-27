// config/db.js
// PURPOSE: This file has ONE job — connect to MongoDB
// We keep it separate so server.js stays clean

const mongoose = require('mongoose')  // mongoose talks to MongoDB for us

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we await it
    const conn = await mongoose.connect(process.env.MONGO_URI)

    // conn.connection.host tells us which server we connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`)

  } catch (error) {
    // If connection fails, print the error and EXIT the app
    // There's no point running a hostel app with no database!
    console.error(`Error: ${error.message}`)
    process.exit(1)  // 1 means "exit with failure"
  }
}

module.exports = connectDB