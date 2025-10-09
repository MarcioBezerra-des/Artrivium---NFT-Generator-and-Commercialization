import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import NFTGenerationPage from './pages/NFTGenerationPage';
import MarketplacePage from './pages/MarketplacePage';
import UserGalleryPage from './pages/UserGalleryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminContentPage from './pages/admin/ContentPage';
import AdminUsersPage from './pages/admin/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

const App: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="generate" element={<NFTGenerationPage />} />
            <Route path="gallery" element={<UserGalleryPage />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;