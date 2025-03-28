import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './Admin-Sidebar';
import EditUsers from './Edit-User';
import AddAdmin from './Add-Admin';
import AddProducts from './Add-Products';
import AddSales from './Add-Sales';

export default function Admin() {
  return (
    <div className="admin-panel-container">
      <AdminSidebar />
      <div className="admin-content">
        <Routes>
          <Route path="edit-users" element={<EditUsers />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="add-products" element={<AddProducts />} />
          <Route path="add-sales" element={<AddSales />} />

          {/* Optionally, a default route: */}
          <Route path="*" element={<EditUsers />} />
        </Routes>
      </div>
    </div>
  );
}
