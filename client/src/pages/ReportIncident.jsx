import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";

const LocationMarker = ({ setPosition }) => {
  const [position, setPos] = useState(null);
  useMapEvents({
    click(e) {
      setPos(e.latlng);
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} />;
};

const ReportIncident = () => {
  const { user } = useAuth();
  const [alertType, setAlertType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alertType || !description || !location) {
      setMessage(
        "All fields (Alert Type, Description, and Location) are required"
      );
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/alerts",
        {
          type: alertType,
          description,
          location: { lat: location.lat, lng: location.lng },
          userId: user.id,
        },
        { withCredentials: true }
      );
      setMessage("Alert submitted successfully");
      setAlertType("");
      setDescription("");
      setLocation(null);
    } catch (err) {
      setMessage("Error submitting alert");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            Report Incident
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Alert Type
              </label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full border border-blue-900/30 rounded-md p-3"
                required
              >
                <option value="">Select Type</option>
                <option value="Roadblock">Roadblock</option>
                <option value="Accident">Accident</option>
                <option value="Construction">Construction</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-blue-900/30 rounded-md p-3"
                placeholder="Describe the incident"
                required
              />
            </div>
            <input
              type="hidden"
              value={location ? `${location.lat},${location.lng}` : ""}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900 to-purple-800 text-white py-3 rounded-md"
              disabled={!alertType || !description || !location}
            >
              Submit Alert
            </button>
            {message && (
              <p className="text-center mt-4 text-green-600">
                {message.includes("successfully") ? (
                  message
                ) : (
                  <span className="text-red-500">{message}</span>
                )}
              </p>
            )}
          </form>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 h-[500px]">
          <MapContainer
            center={[1.2921, 36.8219]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker setPosition={setLocation} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
