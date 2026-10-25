import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../utils/format';
import '../styles/checkout.css';

const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, subtotal, shipping, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    district: 'Colombo',
  });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  // Nothing to check out? Back to the bag.
  if (items.length === 0 && !placing) return <Navigate to="/cart" replace />;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        // Send only what the server needs; it looks up prices itself
        items: items.map(({ productId, colour, size, qty }) => ({ productId, colour, size, qty })),
        shippingAddress: address,
      });
      clearCart();
      navigate('/orders', { replace: true, state: { placed: data._id } });
    } catch (err) {
      setError(errorMessage(err));
      setPlacing(false);
    }
  };

  return (
    <section className="wrap checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <fieldset>
            <legend>Delivery details</legend>

            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" autoComplete="name"
                value={address.fullName} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="phone">Mobile number</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel"
                placeholder="07X XXX XXXX" pattern="0[0-9]{9}"
                title="10 digits starting with 0, e.g. 0771234567"
                value={address.phone} onChange={handleChange} required />
              <span className="hint">The courier will call this number before delivery.</span>
            </div>

            <div className="field">
              <label htmlFor="address">Street address</label>
              <input id="address" name="address" autoComplete="street-address"
                placeholder="House number, street"
                value={address.address} onChange={handleChange} required />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" autoComplete="address-level2"
                  value={address.city} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="district">District</label>
                <select id="district" name="district" value={address.district} onChange={handleChange}>
                  {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            <div className="payment-option">
              <input type="radio" id="cod" checked readOnly />
              <label htmlFor="cod">
                Cash on delivery
                <small>Pay the courier in cash when your order arrives.</small>
              </label>
            </div>
          </fieldset>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn ink place-order-btn" type="submit" disabled={placing}>
            {placing ? 'Placing order…' : `Place order · ${formatLKR(subtotal + shipping)}`}
          </button>
        </form>

        <aside className="order-summary" aria-label="Order summary">
          <h2>Your order</h2>
          <ul className="summary-items">
            {items.map((i) => (
              <li key={`${i.productId}-${i.colour}-${i.size}`} className="summary-item">
                <span className="summary-thumb" style={{ background: i.colourHex || 'var(--line)' }} />
                <span>
                  {i.name} × {i.qty}
                  <span className="meta">{i.colour} · {i.size}</span>
                </span>
                <span className="price">{formatLKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row"><span>Subtotal</span><span>{formatLKR(subtotal)}</span></div>
          <div className="summary-row">
            <span>Delivery</span><span>{shipping === 0 ? 'Free' : formatLKR(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span><span>{formatLKR(subtotal + shipping)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CheckoutPage;