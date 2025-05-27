import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Homepage = () => {
  const { user, loading } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");

  // Count alerts by type for the bar graph
  const alertTypes = ["Roadblock", "Accident", "Construction", "Other"];
  const alertCounts = alertTypes.map(
    (type) => alerts.filter((a) => a.type === type).length
  );
  const maxCount = Math.max(...alertCounts, 1);

  // Animation state for services
  const [servicesVisible, setServicesVisible] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/alerts", {
          withCredentials: true,
        });
        setAlerts(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Error fetching alerts");
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    // Simple intersection observer to trigger animation
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setServicesVisible(true);
      },
      { threshold: 0.2 }
    );
    if (servicesRef.current) observer.observe(servicesRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
        id="home-section"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
          Stay Ahead of Traffic Jams
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Report incidents, check real-time traffic updates, and find the best
          routes with our community-driven system.
        </p>

        {/* Dynamic CTA Button */}
        {user ? (
          user.role === "driver" ? (
            <Link
              to="/report-incident"
              className="inline-block bg-gradient-to-r from-blue-900 to-purple-800 text-white px-6 py-3 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Report Incident
            </Link>
          ) : (
            <Link
              to={
                user.role === "admin" ? "/admin-dashboard" : "/view-all-alerts"
              }
              className="inline-block bg-gradient-to-r from-blue-900 to-purple-800 text-white px-6 py-3 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
            >
              View Dashboard
            </Link>
          )
        ) : (
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-900 to-purple-800 text-white px-6 py-3 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        )}

        {/* Alert Type Indicators */}
        <div className="flex justify-center space-x-4 mt-6">
          {["Roadblock", "Accident", "Construction", "Other"].map((type) => (
            <span
              key={type}
              className={`${
                type === "Roadblock"
                  ? "bg-purple-600"
                  : type === "Accident"
                  ? "bg-red-500"
                  : type === "Construction"
                  ? "bg-blue-600"
                  : "bg-orange-500"
              } text-white px-3 py-1 rounded text-sm`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Success Story */}
          <div className="relative bg-white shadow-md rounded-lg overflow-hidden h-[400px]">
            <div
              className="h-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url('/src/assets/Nairobi.jpg')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Keeping Nairobi Moving
                </h3>
                <p className="text-sm">
                  Officer Mwangi, a dedicated patrol officer in Nairobi CBD,
                  spotted a roadblock on Tom Mboya Street at 7 AM. Thanks to his
                  quick report on the Traffic Alert System, drivers rerouted via
                  Moi Avenue, saving hours of delay.
                </p>
              </div>
            </div>
          </div>

          {/* Stats with Bar Graph */}
          <div className="bg-white shadow-md rounded-lg p-6 h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Most Common Alerts Today
            </h3>
            <div className="flex-1 flex flex-col justify-center">
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alertTypes.map((type, idx) => (
                    <div key={type} className="flex items-center">
                      <span className="w-28 text-sm">{type}</span>
                      <div
                        className={`h-5 rounded transition-all duration-300 ${
                          type === "Roadblock"
                            ? "bg-purple-600"
                            : type === "Accident"
                            ? "bg-red-500"
                            : type === "Construction"
                            ? "bg-blue-600"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: `${(alertCounts[idx] / maxCount) * 180}px`,
                          minWidth: "10px",
                        }}
                        title={`${alertCounts[idx]} ${type} alerts`}
                      ></div>
                      <span className="ml-2 text-gray-700 font-semibold">
                        {alertCounts[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center mt-12">
                  No active alerts
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about-section" className="mt-12">
          <h3 className="text-2xl font-bold text-blue-900 text-center mb-6">
            About Us
          </h3>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Traffic Alert is a community-driven platform designed to help
            drivers and patrol officers stay informed about road conditions in
            real-time. Our mission is to reduce traffic-related frustrations by
            providing timely updates and incident reporting tools.
          </p>
        </div>

        {/* Services Section */}
        <div id="services-section" className="mt-12" ref={servicesRef}>
          <h3 className="text-2xl font-bold text-blue-900 text-center mb-6">
            Services
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Real-Time Alerts",
                color: "text-blue-600",
                desc: "Get instant notifications about accidents, roadblocks, and hazards as soon as they're reported by the community.",
              },
              {
                title: "Route Suggestions",
                color: "text-green-600",
                desc: "Find the fastest and safest routes based on live traffic and incident data, helping you avoid delays.",
              },
              {
                title: "Community Reporting",
                color: "text-orange-500",
                desc: "Easily report incidents you encounter and help others stay informed. Every report makes the roads safer for everyone.",
              },
              {
                title: "Patrol Verification",
                color: "text-purple-600",
                desc: "Verified patrol officers confirm and update incident statuses, ensuring information is accurate and trustworthy.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow transform
                ${servicesVisible ? "animate-pop-in" : "opacity-0 scale-75"}
                `}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationFillMode: "forwards",
                }}
              >
                <h4 className={`font-bold ${service.color}`}>
                  {service.title}
                </h4>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact-section" className="mt-12">
          <h3 className="text-2xl font-bold text-blue-900 text-center mb-6">
            Contact Us
          </h3>
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-600 text-center mb-4">
              Have questions or need support? Reach out to us!
            </p>
            <div className="space-y-2">
              <p className="flex items-center justify-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                support@trafficalert.com
              </p>
              <p className="flex items-center justify-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +254 123 456 789
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default Homepage;

/* Tailwind CSS custom animation (add to your global CSS, e.g., index.css or App.css):
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.75);
  }
  80% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-pop-in {
  animation: pop-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
*/
