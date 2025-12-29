/**
 * Session Repository (Supabase)
 * Handle session management
 */
import supabase from '../config/supabase.js';

class SessionRepository {
  /**
   * Store user session (optional - using JWT instead)
   */
  async create(sessionData) {
    // Sessions are managed via JWT tokens
    // This is a placeholder for compatibility
    return { id: 1, user_id: sessionData.user_id };
  }

  /**
   * Get session
   */
  async getByToken(token) {
    // Token validation is handled by JWT middleware
    return null;
  }

  /**
   * Delete session
   */
  async deleteByToken(token) {
    // Token invalidation is handled by client-side (token removal)
    return true;
  }
}

export default new SessionRepository();
