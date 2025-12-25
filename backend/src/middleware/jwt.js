/**
 * JWT Middleware
 * Verify JWT token dari request header
 */
import * as AuthService from '../service/AuthService.js';

/**
 * Verify JWT token middleware
 */
export function verifyJWT(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid token'
    });
  }
}

/**
 * Verify admin role middleware
 */
export function verifyAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}

/**
 * Optional JWT middleware (untuk public endpoints yang bisa juga authenticated)
 */
export function optionalJWT(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Token invalid atau expired, lanjut sebagai guest
    next();
  }
}
