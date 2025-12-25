/**
 * Session Repository
 * Menangani semua operasi database untuk sessions
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dbConfig from '../config/database.js';

let db = null;

/**
 * Get database connection
 */
async function getDb() {
  if (!db) {
    db = await open({
      filename: dbConfig.dbPath,
      driver: sqlite3.Database
    });
  }
  return db;
}

/**
 * Create a new session
 */
export async function createSession(userId, token, deviceName, deviceUA, ipAddress, expiresAt) {
  try {
    const database = await getDb();
    const result = await database.run(
      `INSERT INTO sessions (user_id, token, device_name, device_ua, ip_address, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, token, deviceName, deviceUA, ipAddress, expiresAt]
    );
    return result.lastID;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      // Device already has an active session, update it instead
      return updateSessionByDeviceName(userId, token, deviceName, deviceUA, ipAddress, expiresAt);
    }
    throw error;
  }
}

/**
 * Get active sessions for a user
 */
export async function getActiveSessionsByUserId(userId) {
  try {
    const database = await getDb();
    return await database.all(
      `SELECT id, user_id, token, device_name, device_ua, ip_address, last_activity, created_at, expires_at
       FROM sessions
       WHERE user_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP
       ORDER BY last_activity DESC`,
      [userId]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Count active sessions for a user
 */
export async function countActiveSessionsByUserId(userId) {
  try {
    const database = await getDb();
    const result = await database.get(
      `SELECT COUNT(*) as count
       FROM sessions
       WHERE user_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`,
      [userId]
    );
    return result.count;
  } catch (error) {
    throw error;
  }
}

/**
 * Get session by token
 */
export async function getSessionByToken(token) {
  try {
    const database = await getDb();
    return await database.get(
      `SELECT id, user_id, token, device_name, device_ua, ip_address, last_activity, created_at, expires_at, is_active
       FROM sessions
       WHERE token = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Update session last activity
 */
export async function updateSessionLastActivity(token) {
  try {
    const database = await getDb();
    return await database.run(
      `UPDATE sessions
       SET last_activity = CURRENT_TIMESTAMP
       WHERE token = ?`,
      [token]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Update session by device name (for re-login on same device)
 */
export async function updateSessionByDeviceName(userId, newToken, deviceName, deviceUA, ipAddress, expiresAt) {
  try {
    const database = await getDb();
    await database.run(
      `UPDATE sessions
       SET token = ?, device_ua = ?, ip_address = ?, expires_at = ?, last_activity = CURRENT_TIMESTAMP
       WHERE user_id = ? AND device_name = ?`,
      [newToken, deviceUA, ipAddress, expiresAt, userId, deviceName]
    );
    
    // Return the session id
    const session = await database.get(
      `SELECT id FROM sessions WHERE user_id = ? AND device_name = ?`,
      [userId, deviceName]
    );
    return session?.id;
  } catch (error) {
    throw error;
  }
}

/**
 * Deactivate oldest session when max devices exceeded
 */
export async function deactivateOldestSession(userId) {
  try {
    const database = await getDb();
    return await database.run(
      `UPDATE sessions
       SET is_active = 0
       WHERE user_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP
       AND id = (
         SELECT id FROM sessions
         WHERE user_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP
         ORDER BY last_activity ASC
         LIMIT 1
       )`,
      [userId, userId]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Invalidate session (logout from specific device)
 */
export async function invalidateSession(token) {
  try {
    const database = await getDb();
    return await database.run(
      `UPDATE sessions
       SET is_active = 0
       WHERE token = ?`,
      [token]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Invalidate all sessions for a user (logout from all devices)
 */
export async function invalidateAllSessionsByUserId(userId) {
  try {
    const database = await getDb();
    return await database.run(
      `UPDATE sessions
       SET is_active = 0
       WHERE user_id = ?`,
      [userId]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions() {
  try {
    const database = await getDb();
    return await database.run(
      `DELETE FROM sessions
       WHERE expires_at <= CURRENT_TIMESTAMP`
    );
  } catch (error) {
    throw error;
  }
}

export default {
  createSession,
  getActiveSessionsByUserId,
  countActiveSessionsByUserId,
  getSessionByToken,
  updateSessionLastActivity,
  updateSessionByDeviceName,
  deactivateOldestSession,
  invalidateSession,
  invalidateAllSessionsByUserId,
  cleanupExpiredSessions
};
