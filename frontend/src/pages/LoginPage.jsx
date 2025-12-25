/**
 * Login Page
 * Page untuk login user
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.username.trim()) {
        throw new Error('Username harus diisi');
      }
      if (!formData.password.trim()) {
        throw new Error('Password harus diisi');
      }

      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Nawwir Qulubana</h1>
          <p>Sistem Pendukung Keputusan Pemilihan Lurah</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading || authLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading || authLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || authLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? 'Sedang login...' : 'Login'}
          </button>
        </form>

        {/* <div className="login-footer">
          <p>Demo Credentials:</p>
          <p className="demo-cred">
            <strong>Username:</strong> admin<br />
            <strong>Password:</strong> admin123
          </p>
        </div> */}
      </div>

      <div className="login-info">
        <h3>ℹ️ Informasi Sistem</h3>
        <ul>
          <li>Gunakan username dan password yang diberikan oleh administrator</li>
          <li>Jangan pernah bagikan password Anda kepada orang lain</li>
          <li>Setiap login akan tercatat di sistem</li>
          <li>Hubungi administrator jika lupa password</li>
        </ul>
      </div>
    </div>
  );
}
