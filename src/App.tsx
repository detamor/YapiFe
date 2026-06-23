import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import SecurityProvider from './contexts/SecurityContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DonationPage from './pages/donations/DonationPage';
import PaymentStatusPage from './pages/donations/PaymentStatusPage'; // 💳 NEW: Midtrans status receiver
import ChildrenPage from './pages/children/ChildrenPage';
import ChildDetailPage from './pages/children/ChildDetailPage'; // 👶 NEW: Child stories & detail
import ContactPage from './pages/ContactPage';
import ActivitiesPage from './pages/ActivitiesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import DashboardPage from './pages/admin/DashboardPage';
import ChildrenManagementPage from './pages/admin/ChildrenManagementPage';
import ActivitiesManagementPage from './pages/admin/ActivitiesManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import SponsorshipManagementPage from './pages/admin/SponsorshipManagementPage'; // 🤝 NEW: Admin sponsorship dashboard
import DonaturDashboardPage from './pages/donatur/DonaturDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <SecurityProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="auth">
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
              <Route path="donations" element={<DonationPage />} />
              <Route path="donations/status" element={<PaymentStatusPage />} />
              <Route path="children" element={<ChildrenPage />} />
              <Route path="children/:id" element={<ChildDetailPage />} />
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
                <Route
                  path="sponsorship"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SponsorshipManagementPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </SecurityProvider>
    </ErrorBoundary>
  );
}

export default App;
