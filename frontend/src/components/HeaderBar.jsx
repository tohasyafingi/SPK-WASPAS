import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const titleMap = {
  '/': 'Dashboard',
  '/kandidat': 'Kandidat',
  '/kriteria': 'Kriteria',
  '/penilaian': 'Penilaian',
  '/hasil': 'Hasil WASPAS'
};

export default function HeaderBar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const title = titleMap[location.pathname] || 'SPK WASPAS';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <button className="header__toggle" aria-label="Toggle Sidebar" onClick={onToggleSidebar}>
        <span className="hamburger"/>
      </button>
      <div className="header__title">{title}</div>
      <div className="header__user">
        <div className="header__userInfo">
          <div className="userName">{user?.username}</div>
          <div className="userRole">{user?.role}</div>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
