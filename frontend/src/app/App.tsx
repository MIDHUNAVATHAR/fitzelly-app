import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../modules/landing/LandingPage';
import DashboardLoader from '../modules/dashboard/components/DashboardLoader';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import AuthGuard from '../modules/auth/components/AuthGuard';
import RedirectIfAuthenticated from '../modules/auth/components/RedirectIfAuthenticated';
import './style.css';

const GymDashboard = lazy(() => import('../modules/dashboard/pages/GymDashboard'));

export default function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <RedirectIfAuthenticated>
              <LandingPage />
            </RedirectIfAuthenticated>
          } />

          {/* Protected Routes */}
          <Route
            path="/gym/dashboard"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymDashboard />
                </Suspense>
              </AuthGuard>
            }
          />

          {/* Client & Trainer Dashboard Placeholders */}
          <Route
            path="/client/dashboard"
            element={
              <AuthGuard allowedRoles={['client']}>
                <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-bold text-2xl">
                  Client Dashboard (Coming Soon)
                </div>
              </AuthGuard>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <AuthGuard allowedRoles={['trainer']}>
                <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-bold text-2xl">
                  Trainer Dashboard (Coming Soon)
                </div>
              </AuthGuard>
            }
          />

          {/* 404 - Redirect to home for now */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}