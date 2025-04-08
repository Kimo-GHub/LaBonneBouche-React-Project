import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, functions } from "../../Firebase/firebase";
import { httpsCallable } from "firebase/functions";
import "../../styles/Admin/View-Orders.css";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const orderList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus, customerEmail) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });

      // Send email via Cloud Function
      const sendEmail = httpsCallable(functions, "sendOrderStatusEmail");
      await sendEmail({ email: customerEmail, orderId, status: newStatus });

      fetchOrders(); // refresh orders
    } catch (error) {
      console.error("Error updating order status or sending email:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="view-orders-container">
      <h2>All Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Delivery Method</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
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
                <td>
                  <select
                    value={order.status || "in progress"}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value, order.customerEmail)
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
      )}
    </div>
  );
}

export default ViewOrders;
