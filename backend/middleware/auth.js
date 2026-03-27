const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      return next()  // ← add RETURN here to stop further execution
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  // Only reaches here if no Authorization header at all
  return res.status(401).json({ message: 'Not authorized, no token' })
}

const adminOnly = (req, res, next) => {  // was nextnext, now fixed
  if (req.user && req.user.role === 'admin') {
    return next()
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' })
  }
}

module.exports = { protect, adminOnly }