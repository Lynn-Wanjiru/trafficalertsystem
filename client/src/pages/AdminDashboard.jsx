import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { format } from "date-fns";

const AdminDashboard = ({ user, setUser }) => {
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newPatrol, setNewPatrol] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/api/users", {
          withCredentials: true,
        });
        const alertRes = await axios.get("/api/alerts", {
          withCredentials: true,
        });
        setUsers(userRes.data);
        setAlerts(alertRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      }
    };
    fetchData();
  }, []);

  const createPatrol = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users", newPatrol, { withCredentials: true });
      const userRes = await axios.get("/api/users", { withCredentials: true });
      setUsers(userRes.data);
      setNewPatrol({ userId: "", name: "", email: "", password: "" });
      setMessage("Patrol officer created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating patrol officer");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== id));
      setMessage("User deleted successfully");
    } catch (err) {
      setError("Error deleting user");
    }
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(`/api/alerts/${id}`, { withCredentials: true });
      setAlerts(alerts.filter((a) => a._id !== id));
      setMessage("Alert deleted successfully");
    } catch (err) {
      setError("Error deleting alert");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} setUser={setUser} />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Admin Dashboard
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Create Patrol Officer
          </h3>
          <form onSubmit={createPatrol} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                value={newPatrol.userId}
                onChange={(e) =>
                  setNewPatrol({ ...newPatrol, userId: e.target.value })
                }
                className="w-full border rounded-md p-2 focus:ring-blue-900 focus:border-blue-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={newPatrol.name}
                onChange={(e) =>
                  setNewPatrol({ ...newPatrol, name: e.target.value })
                }
                className="w-full border rounded-md p-2 focus:ring-blue-900 focus:border-blue-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={newPatrol.email}
                onChange={(e) =>
                  setNewPatrol({ ...newPatrol, email: e.target.value })
                }
                className="w-full border rounded-md p-2 focus:ring-blue-900 focus:border-blue-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={newPatrol.password}
                onChange={(e) =>
                  setNewPatrol({ ...newPatrol, password: e.target.value })
                }
                className="w-full border rounded-md p-2 focus:ring-blue-900 focus:border-blue-900"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900 to-purple-800 text-white py-2 rounded-md hover:opacity-90"
            >
              Create
            </button>
          </form>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Manage Users</h3>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Manage Alerts
          </h3>
          {alerts.length === 0 ? (
            <p className="text-gray-600">No alerts found.</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Type:</strong> {alert.type}
                  </p>
                  <p>
                    <strong>Description:</strong> {alert.description}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {alert.location.coordinates[1].toFixed(4)},{" "}
                    {alert.location.coordinates[0].toFixed(4)}
                  </p>
                  <p>
                    <strong>Reported By:</strong> {alert.reportedBy.name}
                  </p>
                  <p>
                    <strong>Status:</strong> {alert.status}
                  </p>
                  <p>
                    <strong>Reported:</strong>{" "}
                    {format(new Date(alert.createdAt), "PPp")}
                  </p>
                  {alert.rerouteSuggestion && (
                    <p>
                      <strong>Reroute:</strong> {alert.rerouteSuggestion}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteAlert(alert._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
