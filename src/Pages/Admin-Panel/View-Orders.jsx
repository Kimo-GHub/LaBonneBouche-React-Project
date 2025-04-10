import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import "../../styles/Admin/View-Orders.css";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setOrders(orderList);
      setFilteredOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      const updated = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updated);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSearchAndSort = () => {
    const keyword = searchQuery.trim().toLowerCase();
    let filtered = [...orders];

    if (keyword) {
      filtered = filtered.filter(
        (order) =>
          order.customerPhone?.toLowerCase().includes(keyword) ||
          order.customerName?.toLowerCase().includes(keyword)
      );
    }

    switch (sortOption) {
      case "latest":
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "highest":
        filtered.sort((a, b) => b.total - a.total);
        break;
      case "lowest":
        filtered.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [searchQuery, sortOption, orders]);

  return (
    <div className="view-orders-container">
      <h2>Customer Orders</h2>

      <div className="order-controls">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="latest">Sort by Latest</option>
          <option value="oldest">Sort by Oldest</option>
          <option value="highest">Sort by Highest Total</option>
          <option value="lowest">Sort by Lowest Total</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Delivery</th>
                <th>Items</th>
                <th>Total</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName || "N/A"}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.customerPhone || "-"}</td>
                  <td>{order.deliveryMethod || "N/A"}</td>
                  <td>
                    <ul>
                      {order.items?.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${order.total?.toFixed(2)}</td>
                  <td>{order.createdAt?.toLocaleString()}</td>
                  <td>
                    <select
                      value={order.status || "in progress"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewOrders;
