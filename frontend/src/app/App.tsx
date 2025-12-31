import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../modules/landing/LandingPage';
import DashboardLoader from '../modules/dashboard/components/DashboardLoader';
const GymDashboard = lazy(() => import('../modules/dashboard/pages/GymDashboard'));
import './style.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Placeholder for future specific auth/tenant routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route
          path="/gym/dashboard"
          element={
            <Suspense fallback={<DashboardLoader />}>
              <GymDashboard />
            </Suspense>
          }
        />

        {/* Client & Trainer Dashboard Placeholders */}
        <Route
          path="/client/dashboard"
          element={
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-bold text-2xl">
              Client Dashboard (Coming Soon)
            </div>
          }
        />
        <Route
          path="/trainer/dashboard"
          element={
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-bold text-2xl">
              Trainer Dashboard (Coming Soon)
            </div>
          }
        />

        {/* 404 - Redirect to home for now */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}