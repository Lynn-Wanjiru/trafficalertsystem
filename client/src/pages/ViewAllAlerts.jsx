import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ViewAllAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterType, setFilterType] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("/api/alerts", {
          withCredentials: true,
        });
        setAlerts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setAlerts([]);
        setMessage("Error fetching alerts");
      }
    };
    fetchAlerts();
  }, []);

  // Filtering logic
  const filteredAlerts = alerts.filter((alert) => {
    const alertDate = new Date(alert.createdAt);
    // Get local date and time strings
    const localDate = alertDate.toISOString().slice(0, 10); // YYYY-MM-DD
    const localTime = alertDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // HH:mm

    const matchesDate = filterDate ? localDate === filterDate : true;
    const matchesTime = filterTime ? localTime === filterTime : true;
    const matchesType = filterType ? alert.type === filterType : true;
    return matchesDate && matchesTime && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Alerts</h1>
      {/* Filter controls */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-700">Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Time</label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="border rounded p-2"
            />
            {filterTime && (
              <button
                type="button"
                onClick={() => setFilterTime("")}
                className="text-xs text-gray-500 border px-2 py-1 rounded hover:bg-gray-100"
                title="Clear time filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All</option>
            <option value="Roadblock">Roadblock</option>
            <option value="Accident">Accident</option>
            <option value="Construction">Construction</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      {filteredAlerts.length === 0 && <p>No alerts found.</p>}
      {filteredAlerts.map((alert) => (
        <div key={alert._id} className="bg-white shadow rounded p-4 mb-4">
          <div>
            <strong>Type:</strong> {alert.type} <br />
            <strong>Description:</strong> {alert.description} <br />
            <strong>Posted:</strong>{" "}
            {new Date(alert.createdAt).toLocaleString()}
          </div>
          <button
            className="text-blue-700 underline mt-2"
            onClick={() => setSelectedAlert(alert)}
          >
            View on Map
          </button>
        </div>
      ))}
      {selectedAlert &&
        selectedAlert.location &&
        Array.isArray(selectedAlert.location.coordinates) &&
        selectedAlert.location.coordinates.length === 2 && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-4 relative w-[90vw] max-w-lg">
              <button
                className="absolute top-2 right-2 text-xl"
                onClick={() => setSelectedAlert(null)}
              >
                &times;
              </button>
              <MapContainer
                center={[
                  selectedAlert.location.coordinates[1], // lat
                  selectedAlert.location.coordinates[0], // lng
                ]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[
                    selectedAlert.location.coordinates[1],
                    selectedAlert.location.coordinates[0],
                  ]}
                />
              </MapContainer>
            </div>
          </div>
        )}
    </div>
  );
};

export default ViewAllAlerts;
