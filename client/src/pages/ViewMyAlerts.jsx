import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const ViewMyAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");
  const [editAlert, setEditAlert] = useState(null);
  const [editType, setEditType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState({ lat: "", lng: "" });
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch only the logged-in user's alerts
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/alerts/mine", {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      setAlerts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setAlerts([]);
      setMessage("Error fetching alerts");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  const handleEdit = (alert) => {
    setEditAlert(alert);
    setEditType(alert.type);
    setEditDescription(alert.description);
    setEditLocation({
      lat: alert.location?.coordinates?.[1] || "",
      lng: alert.location?.coordinates?.[0] || "",
    });
    setMessage("");
  };

  const handleSave = async (alertId) => {
    try {
      await axios.put(
        `/api/alerts/${alertId}`,
        {
          type: editType,
          description: editDescription,
          location: {
            type: "Point",
            coordinates: [editLocation.lng, editLocation.lat],
          },
        },
        { withCredentials: true }
      );
      setEditAlert(null);
      setMessage("Alert updated successfully");
      await fetchAlerts(); // Refresh after save
    } catch (err) {
      setMessage("Error updating alert");
    }
  };

  const handleDelete = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      await axios.delete(`/api/alerts/${alertId}`, { withCredentials: true });
      setMessage("Alert deleted successfully");
      await fetchAlerts();
    } catch (err) {
      setMessage("Error deleting alert");
    }
  };

  // Filtering logic
  const filteredAlerts = Array.isArray(alerts)
    ? alerts.filter((alert) => {
        const alertDate = new Date(alert.createdAt);
        const matchesDate = filterDate
          ? alertDate.toISOString().slice(0, 16) === filterDate
          : true;
        const matchesType = filterType ? alert.type === filterType : true;
        return matchesDate && matchesType;
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">View My Alerts</h1>
      {/* Filter controls */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-700">Date/Time</label>
          <input
            type="datetime-local"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded p-2"
          />
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
      <div className="bg-white shadow-md rounded-lg p-6 max-h-[600px] overflow-y-auto">
        {loading ? (
          <p className="text-center text-blue-900">Loading alerts...</p>
        ) : filteredAlerts.length === 0 ? (
          <p className="text-center text-gray-500">
            You have no alerts matching the selected filters.
          </p>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert._id} className="border-b py-2">
              <p>
                <strong>Type:</strong>{" "}
                {editAlert && editAlert._id === alert._id ? (
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="border border-blue-900/30 rounded-md p-2 ml-2"
                    required
                  >
                    <option value="Roadblock">Roadblock</option>
                    <option value="Accident">Accident</option>
                    <option value="Construction">Construction</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  alert.type
                )}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {editAlert && editAlert._id === alert._id ? (
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border border-blue-900/30 rounded-md p-2 ml-2 w-2/3"
                    required
                  />
                ) : (
                  alert.description
                )}
              </p>
              <p>
                <strong>Status:</strong> {alert.status || "Pending"}
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
              {editAlert && editAlert._id === alert._id && (
                <div className="my-2">
                  {editAlert.location &&
                    Array.isArray(editAlert.location.coordinates) &&
                    editAlert.location.coordinates.length === 2 && (
                      <MapContainer
                        center={[editLocation.lat, editLocation.lng]}
                        zoom={15}
                        style={{ height: "200px", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[editLocation.lat, editLocation.lng]}
                          draggable={true}
                          eventHandlers={{
                            dragend: (e) => {
                              const marker = e.target;
                              const position = marker.getLatLng();
                              setEditLocation({
                                lat: position.lat,
                                lng: position.lng,
                              });
                            },
                          }}
                        />
                      </MapContainer>
                    )}
                </div>
              )}
              {editAlert && editAlert._id === alert._id ? (
                <div className="mt-2">
                  <button
                    onClick={() => handleSave(alert._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditAlert(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(alert)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md ml-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ViewMyAlerts;
