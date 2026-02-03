import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useStore';
import { authAPI } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Learning from './pages/Learning';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { token, login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (token && !isAuthenticated) {
      authAPI.getUser()
        .then(response => {
          login(token, response.data);
        })
        .catch(() => {
          useAuthStore.getState().logout();
        });
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="trading" element={<Trading />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="learning" element={<Learning />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
