import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewScan from './pages/NewScan';
import ScanDetail from './pages/ScanDetail';
import Profile from './pages/Profile';
import Landing from './pages/Landing';

/**
 * Protected Route Wrapper Component
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('grfyn_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-900 text-slate-100 font-sans antialiased overflow-x-hidden">
      <div className="print:hidden">
        <Navigation />
      </div>
      <main className="flex-1 bg-cyber-900 pb-10">
        {children}
      </main>
      <footer className="print:hidden border-t border-white/5 bg-slate-950/40 backdrop-blur-sm select-none py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left text-[9px] font-medium uppercase tracking-wider text-slate-500 font-sans">
            © 2026 GRFYN Security Scanner &bull; Terminal Operator Portal &bull; All logs encrypted
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/15 text-emerald-400 text-[9px] font-bold tracking-wider transition-all duration-300 scale-95">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>SECURE SESSION ACTIVE / KONEKSI AMAN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const token = localStorage.getItem('grfyn_token');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes or Public Landing */}
        <Route
          path="/"
          element={
            token ? (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <Landing />
            )
          }
        />
        
        <Route
          path="/scan/new"
          element={
            <ProtectedRoute>
              <NewScan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scan/:id"
          element={
            <ProtectedRoute>
              <ScanDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
