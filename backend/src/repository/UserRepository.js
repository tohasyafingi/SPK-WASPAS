/**
 * User Repository
 * Menangani semua operasi database untuk users
 */
import { getDatabase } from '../database/db.js';

/**
 * Get all users
 */
export async function getAll() {
  try {
    const db = getDatabase();
    const users = await db.all('SELECT id, username, email, nama_lengkap, role, is_active, last_login, created_at FROM users ORDER BY created_at DESC');
    return users || [];
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
}

/**
 * Get user by ID
 */
export async function getById(id) {
  try {
    const db = getDatabase();
    const user = await db.get('SELECT id, username, email, nama_lengkap, role, is_active, last_login, created_at FROM users WHERE id = ?', [id]);
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

/**
 * Get user by username
 */
export async function getByUsername(username) {
  try {
    const db = getDatabase();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    return user;
  } catch (error) {
    throw new Error(`Failed to get user by username: ${error.message}`);
  }
}

/**
 * Create new user
 */
export async function create(userData) {
  try {
    const db = getDatabase();
    const { username, password, email, nama_lengkap, role } = userData;

    const result = await db.run(
      `INSERT INTO users (username, password, email, nama_lengkap, role)
       VALUES (?, ?, ?, ?, ?)`,
      [username, password, email || null, nama_lengkap || null, role || 'user']
    );

    return {
      id: result.lastID,
      username,
      email,
      nama_lengkap,
      role: role || 'user'
    };
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      throw new Error('Username already exists');
    }
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

/**
 * Update user
 */
export async function update(id, userData) {
  try {
    const db = getDatabase();
    const { email, nama_lengkap, role, is_active } = userData;

    await db.run(
      `UPDATE users SET email = ?, nama_lengkap = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [email, nama_lengkap, role, is_active !== undefined ? is_active : 1, id]
    );

    return getById(id);
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

/**
 * Update last login
 */
export async function updateLastLogin(id) {
  try {
    const db = getDatabase();
    await db.run(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
  } catch (error) {
    throw new Error(`Failed to update last login: ${error.message}`);
  }
}

/**
 * Delete user
 */
export async function deleteUser(id) {
  try {
    const db = getDatabase();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Count users
 */
export async function count() {
  try {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM users');
    return result?.count || 0;
  } catch (error) {
    throw new Error(`Failed to count users: ${error.message}`);
  }
}
