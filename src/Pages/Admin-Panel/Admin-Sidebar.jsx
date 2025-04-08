import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import '../../styles/Admin/AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul className="admin-sidebar-menu">
          <li><Link to="/admin-panel/view-orders">View Orders</Link></li>
          <li><Link to="/admin-panel/edit-users">Edit Users</Link></li>
          <li><Link to="/admin-panel/add-products">Add Products</Link></li>
          <li><Link to="/admin-panel/view-products">View Products</Link></li>
          <li><Link to="/admin-panel/add-sales">Add Sales</Link></li>
          <li><Link to="/">Home</Link></li>
          <li className="logout-btn">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
