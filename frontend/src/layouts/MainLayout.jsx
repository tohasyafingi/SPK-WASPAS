import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar collapsed={collapsed} />
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
            display: 'none'
          }}
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
