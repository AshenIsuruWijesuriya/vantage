import { Routes, Route, Outlet } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import ComingSoon from './pages/ComingSoon';

// The parts every page shares; <Outlet /> is where each page appears
const Layout = () => (
  <>
    <AnnouncementBar />
    <Header />
    <main><Outlet /></main>
    <Footer />
  </>
);

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections/:gender" element={<CollectionPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Logged-in customers only */}
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      {/* Admins only */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminProducts />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductForm key="new" />} />
        <Route path="/admin/products/:slug/edit" element={<ProductForm key="edit" />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Route>

      <Route path="*" element={<ComingSoon title="Page not found" />} />
    </Route>
  </Routes>
);

export default App;