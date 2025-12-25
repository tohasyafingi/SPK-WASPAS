import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import KandidatPage from './pages/KandidatPage';
import KriteriaPage from './pages/KriteriaPage';
import PenilaianPage from './pages/PenilaianPage';
import HasilPage from './pages/HasilPage';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import './App.css';

/**
 * Loading Screen Component
 */
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5f7fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    </div>
  );
}

/**
 * Protected Route Component
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
}

/**
 * Main App Component
 */
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kandidat" element={<ProtectedRoute><KandidatPage /></ProtectedRoute>} />
        <Route path="/kriteria" element={<ProtectedRoute><KriteriaPage /></ProtectedRoute>} />
        <Route path="/penilaian" element={<ProtectedRoute><PenilaianPage /></ProtectedRoute>} />
        <Route path="/hasil" element={<ProtectedRoute><HasilPage /></ProtectedRoute>} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

