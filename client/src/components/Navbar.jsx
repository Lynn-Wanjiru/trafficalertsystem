import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/"); // Redirect to homepage
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-purple-800 text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <RouterLink to="/">Traffic Alert</RouterLink>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/#home-section" className="hover:text-gray-300">
            Home
          </a>
          <a href="/#about-section" className="hover:text-gray-300">
            About
          </a>
          <a href="/#services-section" className="hover:text-gray-300">
            Services
          </a>
          <a href="/#contact-section" className="hover:text-gray-300">
            Contact
          </a>
          {/* Show these links when logged in */}
          {!loading && user && (
            <>
              <RouterLink to="/view-my-alerts" className="hover:text-gray-300">
                My Alerts
              </RouterLink>
              <RouterLink to="/view-all-alerts" className="hover:text-gray-300">
                All Alerts
              </RouterLink>
              <RouterLink to="/report-incident" className="hover:text-gray-300">
                Report Incident
              </RouterLink>
            </>
          )}
          {loading ? (
            <span className="animate-pulse text-gray-200 px-2">...</span>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Hi, {user.fullName || user.email}
                  </div>
                  <RouterLink
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </RouterLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <RouterLink to="/login" className="hover:text-gray-300">
              Login
            </RouterLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
