import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignPatrol = () => {
  const [alerts, setAlerts] = useState([]);
  const [patrols, setPatrols] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const alertsRes = await axios.get("/api/admin/alerts", {
        withCredentials: true,
      });
      setAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
      const patrolsRes = await axios.get("/api/admin/users", {
        withCredentials: true,
      });
      setPatrols(
        Array.isArray(patrolsRes.data)
          ? patrolsRes.data.filter((u) => u.role === "patrol")
          : []
      );
    };
    fetchData();
  }, []);

  const handleAssign = async (alertId, patrolId) => {
    await axios.post(
      `/api/admin/assign-patrol`,
      { alertId, patrolId },
      { withCredentials: true }
    );
    setMessage("Patrol assigned!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">Assign Patrol</h1>
      {message && <div className="text-green-700 mb-4">{message}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-700">Alert</th>
              <th className="p-4 text-left text-gray-700">Assign Patrol</th>
              <th className="p-4 text-left text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr
                key={alert._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="p-4">
                  {alert.type} - {alert.description}
                </td>
                <td className="p-4">
                  <select
                    defaultValue=""
                    onChange={(e) => handleAssign(alert._id, e.target.value)}
                    className="border rounded p-2 w-full"
                  >
                    <option value="" disabled>
                      Select Patrol
                    </option>
                    {patrols.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.fullName || p.patrolID}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4"></td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-600">
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

export default AssignPatrol;
