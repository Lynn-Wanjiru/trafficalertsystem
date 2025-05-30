import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn("Unexpected users response:", res.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Manage users error:", err);
        setMessage(
          "Error fetching users. Make sure you’re logged in as admin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== id));
      setMessage("User deleted.");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Error deleting user");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">Manage Users</h1>
      {message && <div className="text-green-700 mb-4">{message}</div>}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-blue-900">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No users found.</div>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-gray-700">Name</th>
                <th className="p-4 text-left text-gray-700">Email/PatrolID</th>
                <th className="p-4 text-left text-gray-700">Role</th>
                <th className="p-4 text-left text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-4">{u.fullName || u.name}</td>
                  <td className="p-4">
                    {u.email && <div>Email: {u.email}</div>}
                    {u.patrolID && <div>Patrol ID: {u.patrolID}</div>}
                  </td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
