import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  // Effect: if user is set (after login), redirect
  useEffect(() => {
    if (user && !loading) {
      navigate("/"); // or navigate(-1) to go back
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setMessage("");
    const result = await login(email, password);
    setLocalLoading(false);
    if (!result.success) {
      setMessage(result.message);
    }
    // No need to navigate here; useEffect will handle redirect on user change
  };

  if (loading && !localLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/10">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 border border-blue-900/20 animate-fade-in">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
                className="w-full border border-blue-900/30 rounded-md p-3"
                placeholder="Enter your email"
                required
                disabled={loading || localLoading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
                className="w-full border border-blue-900/30 rounded-md p-3"
                placeholder="Enter your password"
                required
                disabled={loading || localLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900 to-purple-800 text-white py-3 rounded-md flex items-center justify-center"
              disabled={loading || localLoading}
            >
              {loading || localLoading ? (
                <span>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 inline-block"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
            {message && (
              <p className="text-center text-red-500 mt-4">{message}</p>
            )}
            <p className="text-center text-sm text-gray-600 mt-6">
              Not a user?{" "}
              <Link
                to="/register"
                className="text-blue-900 hover:text-purple-800"
              >
                Please Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
