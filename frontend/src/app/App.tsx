import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../modules/landing/LandingPage';
import { AuthProvider } from '../modules/landing/context/AuthContext';
import AuthGuard from '../modules/landing/components/AuthGuard';
import RedirectIfAuthenticated from '../modules/landing/components/RedirectIfAuthenticated';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '../providers/QueryProvider';
import './style.css';

import GymDashboard from '../modules/gym/pages/GymDashboard';
import GymDetails from '../modules/gym/pages/GymDetails';
import GymPlans from '../modules/gym/pages/GymPlans';
import GymTrainers from '../modules/gym/pages/GymTrainers';
import GymClients from '../modules/gym/pages/GymClients';
import GymMemberships from '../modules/gym/pages/GymMemberships';
import GymEquipment from '../modules/gym/pages/GymEquipment';
import ClientSetupPassword from '../modules/landing/pages/ClientSetupPassword';
import VerifyOtpPage from '../modules/landing/pages/VerifyOtpPage';
import ClientDashboard from '../modules/client/pages/ClientDashboard';
import TrainerDashboard from '../modules/trainer/pages/TrainerDashboard';
import TrainerProfile from '../modules/trainer/pages/TrainerProfile';
import MyClients from '../modules/trainer/pages/MyClients';
import ClientProfile from '../modules/client/pages/ClientProfile';
import SuperAdminDashboard from '../modules/super-admin/pages/SuperAdminDashboard';
import SuperAdminLoginPage from '../modules/landing/pages/SuperAdminLoginPage';
import GymsPage from '../modules/super-admin/pages/GymsPage';
import GymDetailsPage from '../modules/super-admin/pages/GymDetailsPage';
import NotFound from '../modules/landing/pages/NotFound';
import { ROLES } from '../constants/roles';

export default function App() {

  return (
    <QueryProvider>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
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
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymDashboard />
                </AuthGuard>
              }
            />

            <Route
              path="/gym/details"
              element={
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymDetails />
                </AuthGuard>
              }
            />

            <Route
              path="/gym/plans"
              element={
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymPlans />
                </AuthGuard>
              }
            />

            <Route
              path="/gym/trainers"
              element={
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymTrainers />
                </AuthGuard>
              }
            />

            <Route
              path="/gym/clients"
              element={
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymClients />
                </AuthGuard>
              }
            />

            <Route
              path="/gym/memberships"
              element={
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymMemberships />
                </AuthGuard>
              }
            />

            <Route
              path="/gym/equipment"
              element={
                <AuthGuard allowedRoles={[ROLES.GYM]}>
                  <GymEquipment />
                </AuthGuard>
              }
            />

            {/* Client & Trainer Dashboard Placeholders */}
            <Route
              path="/client/profile"
              element={
                <AuthGuard allowedRoles={[ROLES.CLIENT]}>
                  <ClientProfile />
                </AuthGuard>
              }
            />
            <Route
              path="/client/dashboard"
              element={
                <AuthGuard allowedRoles={[ROLES.CLIENT]}>
                  <ClientDashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/trainer/profile"
              element={
                <AuthGuard allowedRoles={[ROLES.TRAINER]}>
                  <TrainerProfile />
                </AuthGuard>
              }
            />
            <Route
              path="/trainer/clients"
              element={
                <AuthGuard allowedRoles={[ROLES.TRAINER]}>
                  <MyClients />
                </AuthGuard>
              }
            />
            <Route
              path="/trainer/dashboard"
              element={
                <AuthGuard allowedRoles={[ROLES.TRAINER]}>
                  <TrainerDashboard />
                </AuthGuard>
              }
            />

            {/* Super Admin Routes ..*/}
            <Route path="/fitzelly-hq/login" element={
              <SuperAdminLoginPage />
            } />

            <Route
              path="/fitzelly-hq"
              element={
                <AuthGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <SuperAdminDashboard />
                </AuthGuard>
              }
            />

            <Route
              path="/fitzelly-hq/gyms"
              element={
                <AuthGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <GymsPage />
                </AuthGuard>
              }
            />

            <Route
              path="/fitzelly-hq/gyms/:id"
              element={
                <AuthGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <GymDetailsPage />
                </AuthGuard>
              }
            />

            {/* 404 - Page Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}