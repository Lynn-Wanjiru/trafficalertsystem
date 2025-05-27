import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, fetchUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/auth/me",
        { fullName, email, password },
        { withCredentials: true }
      );
      setMessage("Update successful");
      await fetchUser(); // Refresh user info in context
      setTimeout(() => {
        navigate("/"); // Redirect to user home page after 1 second
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-green-600">{message}</div>
      )}
    </div>
  );
};

export default Settings;
