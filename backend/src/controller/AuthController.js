/**
 * Auth Controller
 * Menangani HTTP requests untuk authentication
 */
import * as AuthService from '../service/AuthService.js';
import * as SessionService from '../service/SessionService.js';

/**
 * Login handler
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    // Get device info from request
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    
    const result = await AuthService.login({ username, password }, userAgent, ipAddress);
    res.json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
}

/**
 * Create user (admin only)
 */
export async function createUser(req, res) {
  try {
    const { username, password, email, nama_lengkap, role } = req.body;
    const result = await AuthService.createUser({
      username,
      password,
      email,
      nama_lengkap,
      role
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
}

/**
 * Get all users
 */
export async function getAllUsers(req, res) {
  try {
    const result = await AuthService.getAllUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get users'
    });
  }
}

/**
 * Get user by ID
 */
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const result = await AuthService.getUserById(id);
    res.json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found'
    });
  }
}

/**
 * Update user
 */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, nama_lengkap, role, is_active } = req.body;
    const result = await AuthService.updateUser(id, {
      email,
      nama_lengkap,
      role,
      is_active
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
}

/**
 * Delete user
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const result = await AuthService.deleteUserService(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
}

/**
 * Change password
 */
export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From JWT middleware
    const result = await AuthService.changePassword(userId, oldPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password'
    });
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(req, res) {
  try {
    const user = req.user; // From JWT middleware
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
}

/**
 * Get active sessions for current user (multi-device info)
 */
export async function getActiveSessions(req, res) {
  try {
    const userId = req.user.id;
    const sessions = SessionService.getActiveSessions(userId);
    
    res.json({
      success: true,
      data: sessions,
      maxDevices: SessionService.MAX_DEVICES_PER_USER
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve sessions'
    });
  }
}

/**
 * Logout from current device
 */
export async function logoutCurrentDevice(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    
    SessionService.logoutFromDevice(token);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
}

/**
 * Logout from all devices
 */
export async function logoutAllDevices(req, res) {
  try {
    const userId = req.user.id;
    SessionService.logoutFromAllDevices(userId);
    
    res.json({
      success: true,
      message: 'Logged out from all devices'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Logout from all devices failed'
    });
  }
}
