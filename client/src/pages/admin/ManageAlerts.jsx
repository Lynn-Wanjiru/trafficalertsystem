import React, { useEffect, useState } from "react";
import axios from "axios";


const ManageAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchAlerts = async () => {
    const res = await axios.get("/api/admin/alerts", { withCredentials: true });
    setAlerts(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/alerts/${id}`, { withCredentials: true });
    setAlerts(alerts.filter((a) => a._id !== id));
    setMessage("Alert deleted.");
    setTimeout(() => setMessage(""), 2000);
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = !filterType || alert.type === filterType;
    const matchesDate = !filterDate || alert.date === filterDate;
    return matchesType && matchesDate;
  });

  const alertTypes = Array.from(new Set(alerts.map(a => a.type))).filter(Boolean);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">Manage Alerts</h1>
      {message && <div className="text-green-700 mb-4">{message}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter by Type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">All</option>
          {alertTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter by Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-700">Type</th>
              <th className="p-4 text-left text-gray-700">Description</th>
              <th className="p-4 text-left text-gray-700">Status</th>
              <th className="p-4 text-left text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((a) => (
              <tr
                key={a._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="p-4">{a.type}</td>
                <td className="p-4">{a.description}</td>
                <td className="p-4">{a.status}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredAlerts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-600">
                  No alerts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAlerts;
