import React from "react";
import AdminSidebar from "./Admin-Sidebar";  

function AdminPanel()  {
  return (
    <div className="admin-panel-container">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Welcome to the Admin Dashboard</h1>
        {/* Admin panel content */}
      </div>
    </div>
  );
};

export default AdminPanel;
