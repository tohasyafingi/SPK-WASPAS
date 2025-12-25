/**
 * Auth Routes
 * Routes untuk authentication dan user management
 */
import express from 'express';
import * as AuthController from '../controller/AuthController.js';
import { verifyJWT, verifyAdmin } from '../middleware/jwt.js';

const router = express.Router();

/**
 * Public routes
 */
// Login
router.post('/login', AuthController.login);

/**
 * Protected routes (require JWT)
 */
// Get current user info
router.get('/me', verifyJWT, AuthController.getCurrentUser);

// Get active sessions (multi-device)
router.get('/sessions', verifyJWT, AuthController.getActiveSessions);

// Logout from current device
router.post('/logout', verifyJWT, AuthController.logoutCurrentDevice);

// Logout from all devices
router.post('/logout-all', verifyJWT, AuthController.logoutAllDevices);

// Change password
router.post('/change-password', verifyJWT, AuthController.changePassword);

/**
 * Admin only routes
 */
// Create user (admin only)
router.post('/users', verifyJWT, verifyAdmin, AuthController.createUser);

// Get all users (admin only)
router.get('/users', verifyJWT, verifyAdmin, AuthController.getAllUsers);

// Get user by ID (admin only)
router.get('/users/:id', verifyJWT, verifyAdmin, AuthController.getUserById);

// Update user (admin only)
router.put('/users/:id', verifyJWT, verifyAdmin, AuthController.updateUser);

// Delete user (admin only)
router.delete('/users/:id', verifyJWT, verifyAdmin, AuthController.deleteUser);

export default router;
