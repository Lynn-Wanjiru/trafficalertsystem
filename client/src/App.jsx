import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import ReportIncident from "./pages/ReportIncident";
import ViewAllAlerts from "./pages/ViewAllAlerts";
import ViewMyAlerts from "./pages/ViewMyAlerts";
import Settings from "./pages/Settings";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

// Admin Protected Route
const AdminDashboard = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }
  return user && user.role === "admin" ? (
    <div>Admin Dashboard</div>
  ) : (
    <Navigate to="/" replace />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/report-incident"
            element={
              <RequireAuth>
                <ReportIncident />
              </RequireAuth>
            }
          />
          <Route
            path="/view-all-alerts"
            element={
              <RequireAuth>
                <ViewAllAlerts />
              </RequireAuth>
            }
          />
          <Route
            path="/view-my-alerts"
            element={
              <RequireAuth>
                <ViewMyAlerts />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
