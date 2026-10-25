import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="wrap">
      <div>
        <Link to="/" className="logo">VANTAGE</Link>
        <p>Active and lifestyle wear, designed in Sri Lanka.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>
          <li><Link to="/collections/women">Women</Link></li>
          <li><Link to="/collections/men">Men</Link></li>
          <li><Link to="/collections/accessories">Accessories</Link></li>
        </ul>
      </div>
      <div>
        <h4>Help</h4>
        <ul>
          <li>Returns &amp; Exchanges</li>
          <li>Shipping</li>
          <li>Contact Us</li>
        </ul>
      </div>
      <p className="legal">© 2026 Vantage. All prices in LKR, tax included.</p>
    </div>
  </footer>
);

export default Footer;