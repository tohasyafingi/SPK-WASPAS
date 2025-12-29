/**
 * Session Service
 * Menangani logic untuk session management multi-device
 */
import SessionRepository from '../repository/SessionRepository.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRE = '7d';
const INACTIVITY_LIMIT_MINUTES = 30;

/**
 * Get device name from user agent
 */
function _getDeviceName(userAgent = '') {
  if (!userAgent) return 'Unknown Device';
  
  let deviceName = 'Unknown Device';
  
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    deviceName = 'Mobile Device';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    deviceName = 'Tablet';
  } else if (userAgent.includes('Windows')) {
    deviceName = 'Windows PC';
  } else if (userAgent.includes('Mac')) {
    deviceName = 'Mac';
  } else if (userAgent.includes('Linux')) {
    deviceName = 'Linux';
  }
  
  // Add timestamp suffix to make it more unique if same device type
  return `${deviceName}`;
}

/**
 * Create new session for login
 */
export async function createLoginSession(userId, token, userAgent, ipAddress) {
  try {
    // Decode token to get expiration
    const decoded = jwt.verify(token, JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000).toISOString();
    
    // Get device name
    const deviceName = _getDeviceName(userAgent);
    
    // Create new session
    const { sessionId, deviceNameUsed } = await SessionRepository.createSession(userId, token, deviceName, userAgent, ipAddress, expiresAt);
    console.log(`[SessionService] Session created: userId=${userId}, sessionId=${sessionId}, device=${deviceNameUsed}`);
    
    return {
      sessionId,
      deviceName: deviceNameUsed
    };
  } catch (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }
}

/**
 * Get user's active sessions
 */
export async function getActiveSessions(userId) {
  try {
    return await SessionRepository.getActiveSessionsByUserId(userId);
  } catch (error) {
    throw new Error(`Failed to retrieve sessions: ${error.message}`);
  }
}

/**
 * Logout from specific device
 */
export async function logoutFromDevice(token) {
  try {
    await SessionRepository.invalidateSession(token);
    console.log('[SessionService] Session invalidated');
  } catch (error) {
    throw new Error(`Failed to logout: ${error.message}`);
  }
}

/**
 * Logout from all devices
 */
export async function logoutFromAllDevices(userId) {
  try {
    await SessionRepository.invalidateAllSessionsByUserId(userId);
    console.log(`[SessionService] All sessions invalidated for user ${userId}`);
  } catch (error) {
    throw new Error(`Failed to logout from all devices: ${error.message}`);
  }
}

/**
 * Verify session is still active
 */
export async function verifySession(token) {
  try {
    const session = await SessionRepository.getSessionByToken(token);
    if (!session) {
      throw new Error('Session not found or expired');
    }

    // Enforce inactivity timeout
    const cutoff = Date.now() - INACTIVITY_LIMIT_MINUTES * 60 * 1000;
    const lastActivityTs = new Date(session.last_activity || session.created_at || 0).getTime();
    if (lastActivityTs < cutoff) {
      await SessionRepository.invalidateSession(token);
      throw new Error('Session expired due to inactivity');
    }
    
    // Update last activity
    await SessionRepository.updateSessionLastActivity(token);
    return session;
  } catch (error) {
    throw new Error(`Session verification failed: ${error.message}`);
  }
}

/**
 * Clean up all expired sessions (can be called periodically)
 */
export async function cleanupExpiredSessions() {
  try {
    const result = await SessionRepository.cleanupExpiredSessions();
    console.log(`[SessionService] Cleaned up ${result.changes} expired sessions`);
    return result.changes;
  } catch (error) {
    console.error('[SessionService] Cleanup failed:', error.message);
  }
}

export default {
  createLoginSession,
  getActiveSessions,
  logoutFromDevice,
  logoutFromAllDevices,
  verifySession,
  cleanupExpiredSessions
};
