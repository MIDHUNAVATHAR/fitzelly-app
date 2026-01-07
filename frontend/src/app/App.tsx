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
const GymEquipment = lazy(() => import('../modules/dashboard/pages/GymEquipment'));
const ClientSetupPassword = lazy(() => import('../modules/auth/pages/ClientSetupPassword'));
const ClientDashboard = lazy(() => import('../modules/dashboard/pages/ClientDashboard'));
const TrainerDashboard = lazy(() => import('../modules/dashboard/pages/TrainerDashboard'));
const SuperAdminDashboard = lazy(() => import('../modules/super-admin/pages/SuperAdminDashboard'));
const SuperAdminLoginPage = lazy(() => import('../modules/super-admin/pages/SuperAdminLoginPage'));
const GymsPage = lazy(() => import('../modules/super-admin/pages/GymsPage'));

export default function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={
            <RedirectIfAuthenticated>
              <LandingPage />
            </RedirectIfAuthenticated>
          } />

          <Route path="/client/setup-password" element={<Suspense fallback={<div>Loading...</div>}><ClientSetupPassword /></Suspense>} />

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

          <Route
            path="/gym/equipment"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymEquipment />
                </Suspense>
              </AuthGuard>
            }
          />

          {/* Client & Trainer Dashboard Placeholders */}
          <Route
            path="/client/dashboard"
            element={
              <AuthGuard allowedRoles={['client']}>
                <Suspense fallback={<DashboardLoader />}>
                  <ClientDashboard />
                </Suspense>
              </AuthGuard>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <AuthGuard allowedRoles={['trainer']}>
                <Suspense fallback={<DashboardLoader />}>
                  <TrainerDashboard />
                </Suspense>
              </AuthGuard>
            }
          />

          {/* Super Admin Routes */}
          <Route path="/fitzelly-hq/login" element={
            <Suspense fallback={<div>Loading...</div>}>
              <SuperAdminLoginPage />
            </Suspense>
          } />

          <Route
            path="/fitzelly-hq"
            element={
              <AuthGuard allowedRoles={['super-admin']}>
                <Suspense fallback={<DashboardLoader />}>
                  <SuperAdminDashboard />
                </Suspense>
              </AuthGuard>
            }
          />

          <Route
            path="/fitzelly-hq/gyms"
            element={
              <AuthGuard allowedRoles={['super-admin']}>
                <Suspense fallback={<DashboardLoader />}>
                  <GymsPage />
                </Suspense>
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