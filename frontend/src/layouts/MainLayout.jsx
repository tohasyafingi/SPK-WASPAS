import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      setSidebarOpen((open) => !open);
    } else {
      setCollapsed((state) => !state);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`layout ${sidebarOpen ? 'sidebar-open' : ''} ${collapsed ? 'layout--collapsed' : ''}`}>
        <Sidebar collapsed={collapsed} onNavigate={closeSidebar} />
        <div className="layout__content">
          <HeaderBar onToggleSidebar={toggleSidebar} />
          <main className="content" onClick={closeSidebar}>
            {children}
          </main>
        </div>
      </div>
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 999,
            display: 'block'
          }}
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
