import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DonationPage from './pages/donations/DonationPage';
import ChildrenPage from './pages/children/ChildrenPage';
import ContactPage from './pages/ContactPage';
import ActivitiesPage from './pages/ActivitiesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import DashboardPage from './pages/admin/DashboardPage';
import ChildrenManagementPage from './pages/admin/ChildrenManagementPage';
import ActivitiesManagementPage from './pages/admin/ActivitiesManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import DonaturDashboardPage from './pages/donatur/DonaturDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="donations" element={<DonationPage />} />
          <Route path="children" element={<ChildrenPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="donatur">
            <Route
              index
              element={
                <ProtectedRoute
                  allowedRoles={['donatur', 'volunteer', 'admin']}
                >
                  <DonaturDashboardPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="admin">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="children"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ChildrenManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="activities"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ActivitiesManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
