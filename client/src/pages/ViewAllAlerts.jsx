import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ViewAllAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [mapCenter, setMapCenter] = useState([1.2921, 36.8219]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/alerts", {
          withCredentials: true,
        });
        setAlerts(res.data);
      } catch (err) {
        setMessage("Error fetching alerts");
      }
    };
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const alertDate = new Date(alert.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && alertDate < start) return false;
    if (end && alertDate > end) return false;
    return true;
  });

  const handleLocationClick = (lat, lng) => {
    setMapCenter([lat, lng]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">View All Alerts</h1>
      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-blue-900/30 rounded-md p-2"
        />
        <label className="ml-4 mr-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-blue-900/30 rounded-md p-2"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 max-h-[600px] overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <div key={alert._id} className="border-b py-2">
              <p>
                <strong>Type:</strong> {alert.type}
              </p>
              <p>
                <strong>Description:</strong> {alert.description}
              </p>
              <p>
                <strong>Status:</strong> {alert.status || "Pending"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                <span
                  onClick={() =>
                    handleLocationClick(alert.location.lat, alert.location.lng)
                  }
                  className="text-blue-600 cursor-pointer"
                >
                  View on Map
                </span>
              </p>
              <p>
                <strong>Date/Time:</strong>{" "}
                {new Date(alert.createdAt).toLocaleString()}
              </p>
              {alert.verified && (
                <p>
                  <strong>Verified:</strong> Yes
                </p>
              )}
              {alert.suggestedRoutes && (
                <p>
                  <strong>Suggested Routes:</strong>{" "}
                  {alert.suggestedRoutes.join(", ")}
                </p>
              )}
            </div>
          ))}
          {message && (
            <p className="text-center mt-4 text-red-500">{message}</p>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 h-[600px]">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredAlerts.map((alert) => (
              <Marker
                key={alert._id}
                position={[alert.location.lat, alert.location.lng]}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ViewAllAlerts;
