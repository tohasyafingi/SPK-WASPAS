import React from 'react';
import { NavLink } from 'react-router-dom';

const Icon = ({ name }) => {
  // Minimal inline SVG icons to avoid extra deps
  const common = { width: 18, height: 18, fill: 'currentColor' };
  switch (name) {
    case 'dashboard':
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
      );
    case 'kandidat':
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.9 1.7-9.9 4.9v2.4h19.7v-2.4c0-3.2-6.6-4.9-9.8-4.9z"/></svg>
      );
    case 'kriteria':
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M5 3h4v18H5V3zm5 4h4v14h-4V7zm5-2h4v16h-4V5z"/></svg>
      );
    case 'penilaian':
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/></svg>
      );
    case 'hasil':
      return (
        <svg {...common} viewBox="0 0 24 24"><path d="M3 17h3v4H3v-4zm5-7h3v11H8V10zm5 3h3v8h-3v-8zm5-7h3v15h-3V6z"/></svg>
      );
    default:
      return null;
  }
};

export default function Sidebar({ collapsed, onNavigate }) {
  const handleNavigate = () => {
    if (typeof onNavigate === 'function') onNavigate();
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar__brand">Nawwir Qulubana</div>
      <nav className="sidebar__nav">
        <NavLink to="/" end onClick={handleNavigate} className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <Icon name="dashboard" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/kandidat" onClick={handleNavigate} className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <Icon name="kandidat" />
          <span>Kandidat</span>
        </NavLink>
        <NavLink to="/kriteria" onClick={handleNavigate} className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <Icon name="kriteria" />
          <span>Kriteria</span>
        </NavLink>
        <NavLink to="/penilaian" onClick={handleNavigate} className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <Icon name="penilaian" />
          <span>Penilaian</span>
        </NavLink>
        <NavLink to="/hasil" onClick={handleNavigate} className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
          <Icon name="hasil" />
          <span>Hasil WASPAS</span>
        </NavLink>
      </nav>
    </aside>
  );
}
