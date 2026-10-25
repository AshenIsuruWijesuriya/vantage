import { NavLink } from 'react-router-dom';

// Tabs shown at the top of every admin page
const AdminNav = () => (
  <nav className="admin-nav" aria-label="Admin">
    <NavLink to="/admin/products">Products</NavLink>
    <NavLink to="/admin/orders">Orders</NavLink>
  </nav>
);

export default AdminNav;