import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetupPage from "./pages/AdminSetupPage";

function App() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/setup-admin" element={<AdminSetupPage />} />
      </Route>

      {/* =========================
          PATIENT
      ========================== */}

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          DOCTOR
      ========================== */}

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          RECEPTIONIST
      ========================== */}

      <Route
        path="/receptionist/dashboard"
        element={
          <ProtectedRoute allowedRole="RECEPTIONIST">
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ADMIN
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          UNKNOWN URL
      ========================== */}

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
