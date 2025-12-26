import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../modules/landing/LandingPage';
import './style.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Placeholder for future specific auth/tenant routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* 404 - Redirect to home for now */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}