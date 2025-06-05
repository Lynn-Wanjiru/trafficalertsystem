import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatrolLogin = () => {
  const [form, setForm] = useState({ patrolID: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchUser, user } = useAuth();

  useEffect(() => {
    if (user && user.role === "patrol") {
      navigate("/patrol/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { patrolID, password } = form;
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { patrolID, password },
        { withCredentials: true }
      );
      await fetchUser();
      // No need to navigate here; useEffect will handle it
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">Patrol Login</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
      >
        <input
          name="patrolID"
          value={form.patrolID}
          onChange={handleChange}
          placeholder="Patrol ID"
          required
          className="w-full border-gray-300 rounded p-3 focus:ring-2 focus:ring-[#1E3A8A] transition duration-200"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border-gray-300 rounded p-3 focus:ring-2 focus:ring-[#1E3A8A] transition duration-200"
        />
        <button
          type="submit"
          className="w-full bg-[#1E3A8A] text-white py-3 rounded hover:bg-[#6B46C1] transition duration-200"
        >
          Login
        </button>
      </form>
      {error && <div className="text-red-700 mt-4 text-center">{error}</div>}
    </div>
  );
};

export default PatrolLogin;
