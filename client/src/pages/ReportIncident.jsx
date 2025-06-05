import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Fix default marker icon issue with leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    if (
      !alertType ||
      !description ||
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      setError("Please fill all fields and select a location on the map.");
      setSubmitting(false);
      return;
    }
    try {
      console.log({
        type: alertType,
        description,
        location: location && {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/alerts`,
        {
          type: alertType,
          description,
          location: location && {
            type: "Point",
            coordinates: [location.lng, location.lat], // GeoJSON expects [lng, lat]
          },
        },
        { withCredentials: true }
      );
      setSuccess("Alert submitted!");
      setTimeout(() => {
        navigate("/view-my-alerts");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting alert");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Horizontal layout for form and map */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 flex-1 flex flex-col justify-between"
            style={{ minWidth: 0 }}
            autoComplete="off"
          >
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-4">
                Report Incident
              </h1>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
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
                <label className="block text-lg font-medium text-gray-700 mb-2">
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
              {/* Map moved here, inside the form and before the submit button */}
              <div className="my-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Pin Location on Map
                </label>
                <div className="w-full h-[300px] md:h-[350px] rounded-md overflow-hidden">
                  <MapContainer
                    center={[-1.286389, 36.817223]} // Nairobi coordinates
                    zoom={13}
                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                    scrollWheelZoom={false}
                    className="rounded-md"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker setPosition={setLocation} />
                  </MapContainer>
                </div>
                {!location && (
                  <p className="text-red-500 mt-2">
                    Please select a location on the map.
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-900 to-purple-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
              disabled={!alertType || !description || !location || submitting}
            >
              {submitting ? "Submitting..." : "Submit Alert"}
            </button>
          </form>
        </div>
        {/* Message */}
        {(message || error || success) && (
          <div className="flex justify-center mt-4">
            {submitting ? (
              <p className="text-blue-600">Submitting your alert...</p>
            ) : (
              <p className={success ? "text-green-600" : "text-red-500"}>
                {success || error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIncident;
