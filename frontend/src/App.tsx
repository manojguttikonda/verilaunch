import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CandidateProfile from './pages/onboarding/CandidateProfile';
import JobSearch from './pages/jobs/JobSearch';
import ResumeBuilder from './pages/resume/ResumeBuilder';
import VerificationStatus from './pages/verification/VerificationStatus';
import ApplicationTracker from './pages/applications/ApplicationTracker';
import EmployerDashboard from './pages/employer/EmployerDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — require auth token */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/jobs" replace />} />
              <Route path="onboarding" element={<CandidateProfile />} />
              <Route path="jobs" element={<JobSearch />} />
              <Route path="resume" element={<ResumeBuilder />} />
              <Route path="verification" element={<VerificationStatus />} />
              <Route path="applications" element={<ApplicationTracker />} />
              <Route path="employer" element={<EmployerDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
