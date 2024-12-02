import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for error handling
import "./AdminsPage.css";

const AdminsPage = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // User being edited
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    try {
      const endpoint =
        selectedRole === "admin"
          ? "http://localhost:5000/api/admins"
          : "http://localhost:5000/api/moderators";
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth token storage
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (userId, currentRole) => {
    setEditingUser(userId);
    setNewRole(currentRole);
  };

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);
  };

  // Regular Expression for valid roles
  const roleRegex = /^(admin|moderator)$/i; // Only allow "admin" or "moderator"

  const handleSubmit = async (userId) => {
    // Validate new role
    if (!roleRegex.test(newRole)) {
      toast.error("Invalid role. Please select either 'admin' or 'moderator'.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers(); // Refresh list after updating
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="admins-container">
      <h1 className="admins-title">Admin Dashboard</h1>

      <div className="form-group">
        <label>Select Role:</label>
        <select
          className="admins-input"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="admin">Admins</option>
          <option value="moderator">Moderators</option>
        </select>
      </div>

      <div className="admins-table-container">
        <div className="admins-scrollable-table">
          <table className="admins-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={newRole}
                        onChange={handleRoleChange}
                        className="admins-input"
                      />
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <button
                        className="btn admins-buttons add-button"
                        onClick={() => handleSubmit(user.id)}
                      >
                        Change
                      </button>
                    ) : (
                      <button
                        className="btn admins-buttons edit-button"
                        onClick={() => handleEdit(user.id, user.role)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminsPage;
