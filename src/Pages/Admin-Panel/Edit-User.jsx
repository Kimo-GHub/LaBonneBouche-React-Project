import React, { useEffect, useState } from "react";
import { db, deleteUserFromAuth } from "../../Firebase/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../../styles/Admin/Edit-Users.css";

function EditUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [banStart, setBanStart] = useState("");
  const [banEnd, setBanEnd] = useState("");
  const [isLifetimeBan, setIsLifetimeBan] = useState(false);

  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("customer");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "customer");
    setShowEditModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="edit-users-container">
      <div className="user-table">
        <h2>Manage Users</h2>

        <div className="user-filters">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "N/A"}</td>
                  <td>{user.id}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => openEditModal(user)}>Edit</button>
                    <button className="delete-btn" onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}>Delete</button>
                    <button className="ban-btn" onClick={() => { setSelectedUser(user); setShowBanModal(true); }}>Ban</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?
            </p>
            <div className="modal-buttons">
              <button
                className="confirm"
                onClick={async () => {
                  try {
                    await deleteDoc(doc(db, "users", selectedUser.id));
                    await deleteUserFromAuth(selectedUser.id);
                  } catch (error) {
                    console.error("Error deleting user from Firebase Auth:", error.message);
                  } finally {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                    fetchUsers();
                  }
                }}
              >
                Yes, Delete
              </button>
              <button className="cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Ban User</h3>
            <p>Banning <strong>{selectedUser.firstName} {selectedUser.lastName}</strong></p>

            <label>Start Date:</label>
            <input type="date" value={banStart} onChange={(e) => setBanStart(e.target.value)} />

            {!isLifetimeBan && (
              <>
                <label>End Date:</label>
                <input type="date" value={banEnd} onChange={(e) => setBanEnd(e.target.value)} />
              </>
            )}

            <div className="checkbox">
              <input
                type="checkbox"
                id="lifetime"
                checked={isLifetimeBan}
                onChange={() => setIsLifetimeBan(!isLifetimeBan)}
              />
              <label htmlFor="lifetime">Lifetime Ban</label>
            </div>

            <div className="modal-buttons">
              <button
                className="confirm"
                onClick={async () => {
                  await updateDoc(doc(db, "users", selectedUser.id), {
                    banned: true,
                    banStart: banStart || new Date().toISOString(),
                    banEnd: isLifetimeBan ? "lifetime" : banEnd,
                  });
                  setShowBanModal(false);
                  setSelectedUser(null);
                  setBanStart("");
                  setBanEnd("");
                  setIsLifetimeBan(false);
                  fetchUsers();
                }}
              >
                Confirm Ban
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUser(null);
                  setBanStart("");
                  setBanEnd("");
                  setIsLifetimeBan(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit User</h3>
            <input
              type="text"
              placeholder="First Name"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-buttons">
              <button
                className="confirm"
                onClick={async () => {
                  await updateDoc(doc(db, "users", selectedUser.id), {
                    firstName: editFirstName,
                    lastName: editLastName,
                    email: editEmail,
                    role: editRole,
                  });
                  setShowEditModal(false);
                  setSelectedUser(null);
                  fetchUsers();
                }}
              >
                Save Changes
              </button>
              <button className="cancel" onClick={() => { setShowEditModal(false); setSelectedUser(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditUsers;
