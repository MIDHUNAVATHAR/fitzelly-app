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

        {/* 404 - Redirect to home for now */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}