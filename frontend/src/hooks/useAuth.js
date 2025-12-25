/**
 * useAuth Hook
 * Custom hook untuk authentication management
 */
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

// Create auth context
const AuthContext = null;

/**
 * useAuth hook
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();

      // Check if max devices exceeded
      if (data.session && data.session.activeSessionCount > data.session.maxDevices) {
        throw new Error(`Maksimal ${data.session.maxDevices} device dapat login dengan akun ini. Silakan logout dari perangkat lain.`);
      }

      // Store token and user in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('sessionInfo', JSON.stringify(data.session || {}));

      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionInfo');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };
}

export { AuthContext };
