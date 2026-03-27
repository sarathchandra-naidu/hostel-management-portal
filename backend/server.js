const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', require('./routes/studentRoutes'))

const roomRoutes = require('./routes/roomRoutes')
const feeRoutes  = require('./routes/feeRoutes')

app.use('/api/rooms', roomRoutes)
app.use('/api/fees',  feeRoutes)

app.get('/', (req, res) => {
  res.send('Hostel API is running...');
});

// Global Error Handler (The Fix)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[SERVER ERROR]: ${err.message}`);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));