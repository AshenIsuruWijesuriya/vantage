import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admins only. Logged-out visitors go to log in; customers go home.
// (The server checks admin rights on every request too; this just hides the pages.)
const AdminRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoute;