import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignedAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await axios.get("/api/patrol/assigned-alerts", {
        withCredentials: true,
      });
      setAlerts(res.data);
    };

    fetchAlerts();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">
        Assigned Alerts
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 text-gray-600 text-center">
        <p>This is the Assigned Alerts page.</p>
        <ul className="mt-4">
          {alerts.map((alert) => (
            <li key={alert.id} className="mb-2">
              {alert.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssignedAlerts;
