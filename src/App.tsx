import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProgramsPage from './pages/ProgramsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentLoginExisting from './pages/StudentLoginExisting';
import StudentDashboard from './pages/StudentDashboard';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, redirectTo }: { children: React.ReactElement; redirectTo: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/student/register" element={<StudentLogin />} />
            <Route path="/student/login" element={<StudentLoginExisting />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute redirectTo="/admin/login">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute redirectTo="/student/login">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;