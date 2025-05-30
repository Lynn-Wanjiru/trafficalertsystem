import React, { useState } from "react";
import axios from "axios";

const CreatePatrol = () => {
  const [form, setForm] = useState({ name: "", patrolID: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/api/admin/patrols", form, { withCredentials: true });
      setMessage("Patrol officer created successfully!");
      setForm({ name: "", patrolID: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating patrol officer");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">
        Create Patrol Officer
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border-gray-300 rounded p-3 focus:ring-2 focus:ring-[#1E3A8A] transition duration-200"
        />
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
          Create
        </button>
      </form>
      {message && (
        <div className="text-green-700 mt-4 text-center flex justify-between items-center">
          <span>{message}</span>
          <button
            className="ml-4 text-green-900 font-bold"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}
      {error && <div className="text-red-700 mt-4 text-center">{error}</div>}
    </div>
  );
};
export default CreatePatrol;
