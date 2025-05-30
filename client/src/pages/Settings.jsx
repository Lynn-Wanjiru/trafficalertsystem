import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Dummy password update handler
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setMessage("Password updated! (Demo only)");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-700 to-purple-300">
      <div className="bg-white/90 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Settings
        </h2>
        {user?.role === "admin" ? (
          <div>
            <div className="mb-4">
              <div className="font-semibold text-blue-900 mb-2">System Info</div>
              <div className="text-gray-700">Traffic Alert System v1.0</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-blue-900 mb-2">Theme</div>
              <div className="text-gray-700">Light / Dark (coming soon)</div>
            </div>
            <div>
              <div className="font-semibold text-blue-900 mb-2">Language</div>
              <div className="text-gray-700">English (more coming soon)</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full border border-blue-900/30 rounded-md p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900 to-purple-800 text-white py-3 rounded-md"
            >
              Update Password
            </button>
            {message && (
              <div className="text-green-700 text-center">{message}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
