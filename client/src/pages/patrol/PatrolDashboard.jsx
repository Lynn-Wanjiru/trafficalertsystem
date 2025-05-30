import React, { useEffect, useState } from "react";
import axios from "axios";

const PatrolDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");
  const [reroute, setReroute] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const res = await axios.get("/api/alerts", { withCredentials: true });
    setAlerts(res.data);
  };

  const handleEdit = (alert) => {
    setEditId(alert._id);
    setStatus(alert.status);
    setReroute(alert.rerouteSuggestion || "");
    setMessage("");
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `/api/alerts/${id}`,
        { status, rerouteSuggestion: reroute },
        { withCredentials: true }
      );
      setEditId(null);
      setMessage("Alert updated!");
      fetchAlerts();
    } catch (err) {
      setMessage("Error updating alert");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <h2
          className="text-3xl font-bold text-[#1E3A8A] mb-6"
          id="patrol-dashboard"
        >
          Patrol Dashboard
        </h2>
        <div className="mb-8" id="assigned-alerts">
          <h3 className="text-xl font-bold text-[#1E3A8A] mb-4">
            Assigned Alerts
          </h3>
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-4 hover:shadow-xl transition duration-200"
            >
              <div>
                <strong className="text-gray-700">Type:</strong> {alert.type}{" "}
                <br />
                <strong className="text-gray-700">Description:</strong>{" "}
                {alert.description} <br />
                <strong className="text-gray-700">Status:</strong>{" "}
                {alert.status} <br />
                <strong className="text-gray-700">Reroute:</strong>{" "}
                {alert.rerouteSuggestion || "None"}
              </div>
              {editId === alert._id ? (
                <div className="mt-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded p-2 mr-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <input
                    value={reroute}
                    onChange={(e) => setReroute(e.target.value)}
                    placeholder="Reroute suggestion"
                    className="border rounded p-2 mr-2"
                  />
                  <button
                    onClick={() => handleSave(alert._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="ml-2 text-gray-500 hover:text-gray-700 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(alert)}
                  className="text-[#1E3A8A] mt-2 hover:underline transition duration-200"
                >
                  Update Status / Reroute
                </button>
              )}
              {message && <p className="text-green-700 mt-2">{message}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatrolDashboard;
