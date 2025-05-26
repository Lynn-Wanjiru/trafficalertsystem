import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ViewMyAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [mapCenter, setMapCenter] = useState([1.2921, 36.8219]);
  const [message, setMessage] = useState("");
  const [editAlert, setEditAlert] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/alerts/my-alerts/${user.id}`,
          { withCredentials: true }
        );
        setAlerts(res.data);
      } catch (err) {
        setMessage("Error fetching alerts");
      }
    };
    fetchAlerts();
  }, [user.id]);

  const handleEdit = (alert) => {
    setEditAlert(alert);
    setEditDescription(alert.description);
  };

  const handleSave = async (alertId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/alerts/${alertId}`,
        { description: editDescription },
        { withCredentials: true }
      );
      setAlerts(
        alerts.map((alert) =>
          alert._id === alertId
            ? { ...alert, description: editDescription }
            : alert
        )
      );
      setEditAlert(null);
      setMessage("Alert updated successfully");
    } catch (err) {
      setMessage("Error updating alert");
    }
  };

  const handleLocationClick = (lat, lng) => {
    setMapCenter([lat, lng]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">View My Alerts</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-h-[600px] overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert._id} className="border-b py-2">
            <p>
              <strong>Type:</strong> {alert.type}
            </p>
            {editAlert && editAlert._id === alert._id ? (
              <div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-blue-900/30 rounded-md p-2"
                />
                <button
                  onClick={() => handleSave(alert._id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditAlert(null)}
                  className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p>
                  <strong>Description:</strong> {alert.description}
                </p>
                <button
                  onClick={() => handleEdit(alert)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              </>
            )}
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
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
      <div className="mt-6 bg-white shadow-md rounded-lg p-6 h-[400px]">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {alerts.map((alert) => (
            <Marker
              key={alert._id}
              position={[alert.location.lat, alert.location.lng]}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ViewMyAlerts;
