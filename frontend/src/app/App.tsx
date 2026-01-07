import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../modules/landing/LandingPage';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import AuthGuard from '../modules/auth/components/AuthGuard';
import RedirectIfAuthenticated from '../modules/auth/components/RedirectIfAuthenticated';
import './style.css';

import GymDashboard from '../modules/dashboard/pages/GymDashboard';
import GymDetails from '../modules/dashboard/pages/GymDetails';
import GymPlans from '../modules/dashboard/pages/GymPlans';
import GymTrainers from '../modules/dashboard/pages/GymTrainers';
import GymClients from '../modules/dashboard/pages/GymClients';
import GymMemberships from '../modules/dashboard/pages/GymMemberships';
import GymEquipment from '../modules/dashboard/pages/GymEquipment';
import ClientSetupPassword from '../modules/auth/pages/ClientSetupPassword';
import VerifyOtpPage from '../modules/auth/pages/VerifyOtpPage';
import ClientDashboard from '../modules/dashboard/pages/ClientDashboard';
import TrainerDashboard from '../modules/dashboard/pages/TrainerDashboard';
import SuperAdminDashboard from '../modules/super-admin/pages/SuperAdminDashboard';
import SuperAdminLoginPage from '../modules/super-admin/pages/SuperAdminLoginPage';
import GymsPage from '../modules/super-admin/pages/GymsPage';

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

          <Route path="/client/setup-password" element={<ClientSetupPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />

          {/* Protected Routes */}
          <Route
            path="/gym/dashboard"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymDashboard />
              </AuthGuard>
            }
          />

          <Route
            path="/gym/details"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymDetails />
              </AuthGuard>
            }
          />

          <Route
            path="/gym/plans"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymPlans />
              </AuthGuard>
            }
          />

          <Route
            path="/gym/trainers"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymTrainers />
              </AuthGuard>
            }
          />

          <Route
            path="/gym/clients"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymClients />
              </AuthGuard>
            }
          />

          <Route
            path="/gym/memberships"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymMemberships />
              </AuthGuard>
            }
          />

          <Route
            path="/gym/equipment"
            element={
              <AuthGuard allowedRoles={['gym']}>
                <GymEquipment />
              </AuthGuard>
            }
          />

          {/* Client & Trainer Dashboard Placeholders */}
          <Route
            path="/client/dashboard"
            element={
              <AuthGuard allowedRoles={['client']}>
                <ClientDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <AuthGuard allowedRoles={['trainer']}>
                <TrainerDashboard />
              </AuthGuard>
            }
          />

          {/* Super Admin Routes */}
          <Route path="/fitzelly-hq/login" element={
            <SuperAdminLoginPage />
          } />

          <Route
            path="/fitzelly-hq"
            element={
              <AuthGuard allowedRoles={['super-admin']}>
                <SuperAdminDashboard />
              </AuthGuard>
            }
          />

          <Route
            path="/fitzelly-hq/gyms"
            element={
              <AuthGuard allowedRoles={['super-admin']}>
                <GymsPage />
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