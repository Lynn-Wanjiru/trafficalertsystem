import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const getDisplayName = () => {
    if (!user) return "";
    if (user.role === "admin") return user.email || "Admin";
    if (user.role === "patrol") return user.patrolID || "Patrol";
    return user.fullName || user.email || "User";
  };

  const adminLinks = [
    { to: "/admin-dashboard", label: "Dashboard" },
    { to: "/admin/create-patrol", label: "Create Patrol" },
    { to: "/admin/manage-users", label: "Manage Users" },
    { to: "/admin/manage-alerts", label: "Manage Alerts" },
    { to: "/admin/assign-patrol", label: "Assign Patrol" },
  ];
  const patrolLinks = [
    { to: "/patrol/assigned-alerts", label: "Assigned Alerts" },
    { to: "/patrol/update-status", label: "Update Status" },
  ];
  const userLinks = [
    { to: "/view-my-alerts", label: "My Alerts" },
    { to: "/view-all-alerts", label: "All Alerts" },
    { to: "/report-incident", label: "Report Incident" },
  ];

  let navLinks = [];
  if (user?.role === "admin") navLinks = adminLinks;
  else if (user?.role === "patrol") navLinks = patrolLinks;
  else if (user?.role === "driver") navLinks = userLinks;

  const universalLinks = [
    { href: "/#home-section", label: "Home" },
    { href: "/#about-section", label: "About" },
    { href: "/#services-section", label: "Services" },
    { href: "/#contact-section", label: "Contact" },
  ];

  const showUniversal = !user || user.role === "driver";

  return (
    <nav className="bg-gradient-to-r from-[#1E3A8A] to-[#6B46C1] text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <RouterLink to="/">Traffic Alert</RouterLink>
        </div>
        <button
          className="sm:hidden ml-2 focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
        <div className="hidden sm:flex items-center space-x-6">
          {showUniversal &&
            universalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-gray-300 transition duration-200"
              >
                {l.label}
              </a>
            ))}
          {navLinks.map((l) => (
            <RouterLink
              key={l.to}
              to={l.to}
              className="hover:text-gray-300 transition duration-200"
            >
              {l.label}
            </RouterLink>
          ))}
          {user && (
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
                    Hi, {getDisplayName()}
                  </div>
                  <RouterLink
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </RouterLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {!user && (
            <RouterLink
              to="/login"
              className="hover:text-gray-300 transition duration-200"
            >
              Login
            </RouterLink>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 bg-gradient-to-r from-[#1E3A8A] to-[#6B46C1] space-y-2">
          {showUniversal &&
            universalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block py-2 hover:text-gray-300 transition duration-200"
              >
                {l.label}
              </a>
            ))}
          {navLinks.map((l) => (
            <RouterLink
              key={l.to}
              to={l.to}
              className="block py-2 hover:text-gray-300 transition duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </RouterLink>
          ))}
          {user && (
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="px-2 py-1 text-sm text-gray-200">
                Hi, {getDisplayName()}
              </div>
              <RouterLink
                to="/settings"
                className="block px-2 py-2 text-sm text-gray-200 hover:bg-white/10 transition duration-200"
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </RouterLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-2 py-2 text-sm text-gray-200 hover:bg-white/10 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
          {!user && (
            <RouterLink
              to="/login"
              className="block py-2 hover:text-gray-300 transition duration-200"
            >
              Login
            </RouterLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
