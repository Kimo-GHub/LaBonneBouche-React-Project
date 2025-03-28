import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/firebase";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [banStart, setBanStart] = useState("");
  const [banEnd, setBanEnd] = useState("");
  const [isLifetimeBan, setIsLifetimeBan] = useState(false);

  // Edit user form
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("customer");

  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // When edit button is clicked
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "customer");
    setShowEditModal(true);
  };

  return (
    <div className="edit-users-container">
      <div className="user-table">
        <h2>Manage Users</h2>

        <table className="styled-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.id}</td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="ban-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowBanModal(true);
                    }}
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser.firstName} {selectedUser.lastName}
              </strong>
              ?
            </p>
            <div className="modal-buttons">
              <button
                className="confirm"
                onClick={async () => {
                  await deleteDoc(doc(db, "users", selectedUser.id));
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                  fetchUsers();
                }}
              >
                Yes, Delete
              </button>
              <button
                className="cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Ban User</h3>
            <p>
              Banning{" "}
              <strong>
                {selectedUser.firstName} {selectedUser.lastName}
              </strong>
            </p>

            <label>Start Date:</label>
            <input
              type="date"
              value={banStart}
              onChange={(e) => setBanStart(e.target.value)}
            />

            {!isLifetimeBan && (
              <>
                <label>End Date:</label>
                <input
                  type="date"
                  value={banEnd}
                  onChange={(e) => setBanEnd(e.target.value)}
                />
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

      {/* Edit User Modal */}
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
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
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
              <button
                className="cancel"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditUsers;
