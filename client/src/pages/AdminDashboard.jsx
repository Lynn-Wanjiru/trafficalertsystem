import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link, useLocation } from "react-router-dom";

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition duration-200">
    <div className="text-3xl text-[#1E3A8A]">{icon}</div>
    <div>
      <div className="text-lg font-semibold text-gray-700">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newPatrol, setNewPatrol] = useState({
    name: "",
    patrolID: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchUsers();
    fetchAlerts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        withCredentials: true,
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("/api/admin/alerts", {
        withCredentials: true,
      });
      setAlerts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching alerts");
    }
  };

  const createPatrol = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await axios.post("/api/admin/patrols", newPatrol, {
        withCredentials: true,
      });
      setNewPatrol({ name: "", patrolID: "", password: "" });
      setMessage("Patrol officer created successfully");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating patrol officer");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== id));
      setMessage("User deleted successfully");
    } catch (err) {
      setError("Error deleting user");
    }
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(`/api/admin/alerts/${id}`, { withCredentials: true });
      setAlerts(alerts.filter((a) => a._id !== id));
      setMessage("Alert deleted successfully");
    } catch (err) {
      setError("Error deleting alert");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-8">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <SummaryCard title="Total Users" value={users.length} icon="👥" />
          <SummaryCard
            title="Active Alerts"
            value={alerts.filter((a) => a.status === "pending").length}
            icon="🚨"
          />
          <SummaryCard
            title="Patrol Officers"
            value={users.filter((u) => u.role === "patrol").length}
            icon="🛡️"
          />
          <SummaryCard
            title="Resolved Alerts"
            value={alerts.filter((a) => a.status === "resolved").length}
            icon="✅"
          />
        </div>
        <div className="text-gray-600 text-center mb-8">
          Welcome, Admin! Use the navigation above to manage the system.
        </div>
        {error && <div className="text-red-700 text-center mb-4">{error}</div>}
        {message && (
          <div className="text-green-700 text-center mb-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
