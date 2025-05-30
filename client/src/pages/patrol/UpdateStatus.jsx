import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateStatus = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/patrol/assigned-alerts", {
          withCredentials: true,
        });
        setAlerts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load alerts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleStatusChange = async (alertId, newStatus) => {
    setMessage("");
    setError("");
    try {
      await axios.patch(
        `/api/patrol/alerts/${alertId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setAlerts(
        alerts.map((alert) =>
          alert._id === alertId ? { ...alert, status: newStatus } : alert
        )
      );
      setMessage("Status updated!");
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">
        Update Alert Status
      </h1>
      {message && <div className="mb-4 text-green-700">{message}</div>}
      {error && <div className="mb-4 text-red-700">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="text-center text-gray-600">No assigned alerts.</div>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200"
            >
              <div>
                <strong className="text-gray-700">Type:</strong> {alert.type}
                <br />
                <strong className="text-gray-700">Description:</strong>{" "}
                {alert.description}
                <br />
                <strong className="text-gray-700">Status:</strong>{" "}
                {alert.status}
              </div>
              <div className="mt-4">
                <label className="mr-2 font-semibold text-gray-700">
                  Change Status:
                </label>
                <select
                  value={alert.status}
                  onChange={(e) =>
                    handleStatusChange(alert._id, e.target.value)
                  }
                  className="border rounded p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpdateStatus;
