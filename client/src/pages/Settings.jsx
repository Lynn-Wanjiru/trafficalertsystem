import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, fetchUser } = useAuth();
  const [name, setName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        { fullName: name, email, password },
        { withCredentials: true }
      );
      await fetchUser();
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-blue-900/30 rounded-md p-3"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blue-900/30 rounded-md p-3"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-blue-900/30 rounded-md p-3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-900 to-purple-800 text-white py-3 rounded-md"
          >
            Update Profile
          </button>
          {message && (
            <p className="text-center mt-4 text-green-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;
