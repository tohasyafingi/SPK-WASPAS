/**
 * Auth Service
 * Menangani logic authentication dan JWT
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../repository/UserRepository.js';
import * as SessionService from './SessionService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

/**
 * Validate login data
 */
function _validateLoginData(data) {
  const errors = [];

  if (!data.username || data.username.trim() === '') {
    errors.push('Username harus diisi');
  }
  if (!data.password || data.password.trim() === '') {
    errors.push('Password harus diisi');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
}

/**
 * Validate user creation data
 */
function _validateUserData(data) {
  const errors = [];

  if (!data.username || data.username.trim() === '') {
    errors.push('Username harus diisi');
  }
  if (data.username && data.username.length < 3) {
    errors.push('Username minimal 3 karakter');
  }
  if (!data.password || data.password.trim() === '') {
    errors.push('Password harus diisi');
  }
  if (data.password && data.password.length < 6) {
    errors.push('Password minimal 6 karakter');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
}

/**
 * Hash password
 */
async function _hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password
 */
async function _comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token
 */
function _generateToken(userId, username, role) {
  return jwt.sign(
    {
      id: userId,
      username: username,
      role: role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

/**
 * Verify JWT token
 */
function _verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Login user
 */
export async function login(credentials, userAgent = '', ipAddress = '') {
  try {
    _validateLoginData(credentials);

    console.log('[AuthService] Login attempt:', credentials.username);

    const user = await UserRepository.getByUsername(credentials.username);
    console.log('[AuthService] User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      throw new Error('Username atau password salah');
    }

    console.log('[AuthService] User active:', user.is_active);
    if (!user.is_active) {
      throw new Error('Akun ini tidak aktif');
    }

    console.log('[AuthService] Comparing passwords...');
    const isPasswordValid = await _comparePassword(credentials.password, user.password);
    console.log('[AuthService] Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      throw new Error('Username atau password salah');
    }

    // Update last login
    await UserRepository.updateLastLogin(user.id);

    // Generate token
    const token = _generateToken(user.id, user.username, user.role);

    // Create session for multi-device tracking
    const sessionInfo = await SessionService.createLoginSession(user.id, token, userAgent, ipAddress);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      },
      session: sessionInfo
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Create user (admin only - tanpa register)
 */
export async function createUser(userData) {
  try {
    _validateUserData(userData);

    // Hash password
    const hashedPassword = await _hashPassword(userData.password);

    // Create user
    const user = await UserRepository.create({
      username: userData.username.trim(),
      password: hashedPassword,
      email: userData.email,
      nama_lengkap: userData.nama_lengkap,
      role: userData.role || 'user'
    });

    return {
      success: true,
      user
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Verify token (untuk middleware)
 */
export function verifyToken(token) {
  return _verifyToken(token);
}

/**
 * Get all users
 */
export async function getAllUsers() {
  try {
    const users = await UserRepository.getAll();
    return {
      success: true,
      users
    };
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
  try {
    const user = await UserRepository.getById(id);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }
    return {
      success: true,
      user
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Update user
 */
export async function updateUser(id, userData) {
  try {
    const user = await UserRepository.update(id, userData);
    return {
      success: true,
      user
    };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

/**
 * Delete user
 */
export async function deleteUserService(id) {
  try {
    await UserRepository.deleteUser(id);
    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Change password
 */
export async function changePassword(userId, oldPassword, newPassword) {
  try {
    if (!oldPassword || !newPassword) {
      throw new Error('Old password dan new password harus diisi');
    }

    if (newPassword.length < 6) {
      throw new Error('Password baru minimal 6 karakter');
    }

    const user = await UserRepository.getById(userId);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    const isPasswordValid = await _comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Old password salah');
    }

    const hashedPassword = await _hashPassword(newPassword);
    await UserRepository.update(userId, { password: hashedPassword });

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
