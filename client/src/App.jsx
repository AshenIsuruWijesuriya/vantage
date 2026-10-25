import { Routes, Route, Outlet } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
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
      <Route path="/collections/:gender" element={<ComingSoon title="Collection" />} />
      <Route path="/products/:slug" element={<ComingSoon title="Product" />} />
      <Route path="/cart" element={<ComingSoon title="Your bag" />} />
      <Route path="/login" element={<ComingSoon title="Log in" />} />
      <Route path="/register" element={<ComingSoon title="Create account" />} />
      <Route path="*" element={<ComingSoon title="Page not found" />} />
    </Route>
  </Routes>
);

export default App;