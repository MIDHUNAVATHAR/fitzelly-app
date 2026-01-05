import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../modules/landing/LandingPage';
import DashboardLoader from '../modules/dashboard/components/DashboardLoader';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import AuthGuard from '../modules/auth/components/AuthGuard';
import RedirectIfAuthenticated from '../modules/auth/components/RedirectIfAuthenticated';
import './style.css';

const GymDashboard = lazy(() => import('../modules/dashboard/pages/GymDashboard'));
const GymDetails = lazy(() => import('../modules/dashboard/pages/GymDetails'));
const GymPlans = lazy(() => import('../modules/dashboard/pages/GymPlans'));
const GymTrainers = lazy(() => import('../modules/dashboard/pages/GymTrainers'));
const GymClients = lazy(() => import('../modules/dashboard/pages/GymClients'));
const GymMemberships = lazy(() => import('../modules/dashboard/pages/GymMemberships'));

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

          <Route
            path="/gym/details"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymDetails />
                </Suspense>
              </AuthGuard>
            }
          />

          <Route
            path="/gym/plans"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymPlans />
                </Suspense>
              </AuthGuard>
            }
          />

          <Route
            path="/gym/trainers"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymTrainers />
                </Suspense>
              </AuthGuard>
            }
          />

          <Route
            path="/gym/clients"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymClients />
                </Suspense>
              </AuthGuard>
            }
          />

          <Route
            path="/gym/memberships"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymMemberships />
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