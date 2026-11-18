/**
 * Authentication Middleware
 * Validates JWT Bearer tokens and attaches the authenticated user to the request.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'heartcraft_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session. User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or token is invalid.', error: error.message });
  }
};

// Optional auth: attaches user if token is present, does not block if not
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'heartcraft_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);
      req.user = User.findById(decoded.id);
    }
  } catch (err) {
    // ignore
  }
  next();
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
