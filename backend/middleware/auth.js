const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid or expired token.' 
    });
  }
};

/**
 * Middleware to verify admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

/**
 * Middleware to verify student role
 */
const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ 
      error: 'Access denied. Student privileges required.' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireStudent
};
