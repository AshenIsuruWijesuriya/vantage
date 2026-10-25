import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <nav className="main-nav" aria-label="Main">
          <NavLink to="/collections/women">Women</NavLink>
          <NavLink to="/collections/men">Men</NavLink>
          <NavLink to="/collections/accessories">Accessories</NavLink>
        </nav>

        <Link to="/" className="logo">VANTAGE</Link>

        <div className="header-actions">
          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
          <Link to="/cart">Bag (0)</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;