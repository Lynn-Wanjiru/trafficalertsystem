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
import PatrolDashboard from "./pages/patrol/PatrolDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePatrol from "./pages/admin/CreatePatrol";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAlerts from "./pages/admin/ManageAlerts";
import AssignPatrol from "./pages/admin/AssignPatrol";
import PatrolAssignedAlerts from "./pages/patrol/AssignedAlerts";
import PatrolUpdateStatus from "./pages/patrol/UpdateStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PatrolLogin from "./pages/patrol/PatrolLogin";

// General protected route for logged-in users
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
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patrol/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patrol"]}>
                <PatrolDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Login role="admin" />} />
          <Route path="/patrol" element={<Login role="patrol" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-patrol" element={<CreatePatrol />} />
          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/manage-alerts" element={<ManageAlerts />} />
          <Route path="/admin/assign-patrol" element={<AssignPatrol />} />
          <Route
            path="/patrol/assigned-alerts"
            element={<PatrolAssignedAlerts />}
          />
          <Route
            path="/patrol/update-status"
            element={<PatrolUpdateStatus />}
          />
          <Route path="/patrol/login" element={<PatrolLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
