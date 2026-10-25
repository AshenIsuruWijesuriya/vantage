import { Routes, Route, Outlet } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
      <Route path="/products/:slug" element={<ComingSoon title="Product" />} />
      <Route path="/cart" element={<ComingSoon title="Your bag" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<ComingSoon title="Page not found" />} />
    </Route>
  </Routes>
);

export default App;