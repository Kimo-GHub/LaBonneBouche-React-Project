import React, { useEffect, useState } from "react";
import {
  getAuth,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ This is required!
import "../../styles/Profile/ProfileSettings.css";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOrders, setShowOrders] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().phoneNumber) {
        setPhoneNumber(snap.data().phoneNumber);
      }

      const q = query(
        collection(db, "orders"),
        where("customerEmail", "==", currentUser.email)
      );
      const snapshot = await getDocs(q);
      const userOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(userOrders);
      setLoading(false);
    };

    fetchData();
  }, [currentUser, db]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch(console.error);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(currentUser);
      navigate("/login");
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!currentUser) return;
    try {
      const ref = doc(db, "users", currentUser.uid);
      await updateDoc(ref, { phoneNumber: phoneNumber });
      setMessage("Phone number updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update failed", err);
      setMessage("Failed to update phone number.");
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const status = (order.status || "In Progress").toLowerCase();
      return filterStatus === "All" || status === filterStatus.toLowerCase();
    })
    .filter((order) => {
      const query = searchQuery.toLowerCase();
      return (
        order.items?.some((item) => item.name.toLowerCase().includes(query)) ||
        order.deliveryMethod?.toLowerCase().includes(query)
      );
    });

  const exportToCSV = () => {
    if (!filteredOrders.length) return;

    const headers = ["Date", "Items", "Delivery", "Discount", "Total", "Status"];
    const rows = filteredOrders.map((order) => [
      order.createdAt?.toDate().toLocaleDateString(),
      order.items?.map((item) => item.name).join(", "),
      order.deliveryMethod,
      `$${order.discount?.toFixed(2) || "0.00"}`,
      `$${order.total?.toFixed(2) || "0.00"}`,
      order.status || "In Progress"
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  const exportToPDF = () => {
    if (!filteredOrders.length) return;

    const doc = new jsPDF();
    const headers = ["Date", "Items", "Delivery", "Discount", "Total", "Status"];
    const rows = filteredOrders.map((order) => [
      order.createdAt?.toDate().toLocaleDateString(),
      order.items?.map((item) => item.name).join(", "),
      order.deliveryMethod || "N/A",
      `$${order.discount?.toFixed(2) || "0.00"}`,
      `$${order.total?.toFixed(2) || "0.00"}`,
      order.status || "In Progress"
    ]);

    doc.text("Order History", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save("orders.pdf");
  };

  return (
    <div className="profile-settings">
      <h2>Account Settings</h2>

      {!loading && (
        <>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
              placeholder="Enter phone number"
            />
            <button onClick={handlePhoneUpdate} className="update-btn">
              Update Phone Number
            </button>
          </div>

          <div className="order-history">
            <h3>
              Your Order History{" "}
              <button onClick={() => setShowOrders(!showOrders)} className="toggle-orders-btn">
  {showOrders ? "Hide Orders" : "Show Orders"}
</button>

            </h3>

            {showOrders && (
              <>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-dropdown"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />

<button onClick={exportToCSV} className="export-btn csv">Export Excel</button>
<button onClick={exportToPDF} className="export-btn pdf">Export PDF</button>

                </div>

                {filteredOrders.length === 0 ? (
                  <p>No matching orders found.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Delivery</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.createdAt?.toDate().toLocaleDateString()}</td>
                          <td>
                            {order.items?.map((item, index) => (
                              <div key={index}>{item.name}</div>
                            ))}
                          </td>
                          <td>{order.deliveryMethod}</td>
                          <td>${order.discount?.toFixed(2) || "0.00"}</td>
                          <td>${order.total?.toFixed(2) || "0.00"}</td>
                          <td>{order.status || "In Progress"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>

          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <button onClick={() => setShowDeleteModal(true)} className="delete-btn">Delete Account</button>
          {message && <p className="status-message">{message}</p>}
        </>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete your account?</h3>
            <button onClick={handleDeleteAccount} className="delete-confirm-btn">Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)} className="delete-cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
