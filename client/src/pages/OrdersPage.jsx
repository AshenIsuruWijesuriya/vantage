import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import { formatLKR } from '../utils/format';
import '../styles/orders.css';

// A short, readable order number from the MongoDB id, e.g. #A3F9C1
const orderNumber = (id) => `#${id.slice(-6).toUpperCase()}`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' });

const OrdersPage = () => {
  const location = useLocation();
  const justPlaced = location.state?.placed; // set by the checkout page

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/mine')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="wrap orders-page">
      <h1>My orders</h1>

      {justPlaced && (
        <p className="placed-banner" role="status">
          <strong>Thanks, your order is placed</strong>
          <span>
            Order {orderNumber(justPlaced)} · We'll call you before delivery. Pay the courier in cash.
          </span>
        </p>
      )}

      {loading && <p className="status-msg">Loading your orders…</p>}
      {error && <p className="form-error">Couldn't load your orders: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="page-message">
          <p>You haven't placed any orders yet.</p>
          <Link className="btn ink" to="/collections/women">Start shopping</Link>
        </div>
      )}

      <ul className="order-list">
        {orders.map((order) => (
          <li key={order._id} className={`order-card ${order._id === justPlaced ? 'highlight' : ''}`}>
            <div className="order-head">
              <div>
                <span className="order-no">Order {orderNumber(order._id)}</span>
                <div className="order-date">Placed {formatDate(order.createdAt)}</div>
              </div>
              <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>

            <div className="order-body">
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item._id}>
                    <span>
                      {item.name} × {item.qty}
                      <span className="meta">{item.colour} · Size {item.size}</span>
                    </span>
                    <span className="price">{formatLKR(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="order-side">
                <div>
                  <h3>Deliver to</h3>
                  <address>
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.district}<br />
                    {order.shippingAddress.phone}
                  </address>
                </div>

                <div className="order-totals">
                  <div className="summary-row"><span>Subtotal</span><span>{formatLKR(order.itemsPrice)}</span></div>
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span>{order.shippingPrice === 0 ? 'Free' : formatLKR(order.shippingPrice)}</span>
                  </div>
                  <div className="summary-row total"><span>Total</span><span>{formatLKR(order.totalPrice)}</span></div>
                  <div className="summary-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OrdersPage;