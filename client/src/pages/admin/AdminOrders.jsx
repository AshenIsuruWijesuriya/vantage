import { Fragment, useEffect, useState } from 'react';
import api, { errorMessage } from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import { formatLKR } from '../../utils/format';
import '../../styles/admin.css';
import '../../styles/orders.css'; // status pill colours

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const FILTERS = ['All', ...STATUSES];

const orderNumber = (id) => `#${id.slice(-6).toUpperCase()}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [openId, setOpenId] = useState(null); // which order's details are expanded

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (order, status) => {
    setError('');
    setMessage('');
    setSavingId(order._id);
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, { status });
      setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status: data.status } : o)));
      setMessage(`Order ${orderNumber(order._id)} is now ${status}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSavingId(null);
    }
  };

  const counts = Object.fromEntries(
    FILTERS.map((f) => [f, f === 'All' ? orders.length : orders.filter((o) => o.status === f).length])
  );
  const shown = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <section className="wrap admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Orders</h1>
        </div>
      </div>

      <AdminNav />

      <div className="chips" role="group" aria-label="Filter orders by status" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {message && <p className="admin-msg" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading && <p className="status-msg">Loading orders…</p>}
      {!loading && shown.length === 0 && <p className="status-msg">No orders here.</p>}

      {shown.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th className="num">Items</th>
                <th className="num">Total</th>
                <th>Status</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <Fragment key={o._id}>
                  <tr>
                    <td>
                      <button className="text-btn" onClick={() => setOpenId(openId === o._id ? null : o._id)}
                        aria-expanded={openId === o._id}>
                        {orderNumber(o._id)}
                      </button>
                    </td>
                    <td className="muted">{formatDate(o.createdAt)}</td>
                    <td>
                      <strong>{o.shippingAddress.fullName}</strong>
                      <span className="muted" style={{ display: 'block' }}>{o.user?.email || 'Deleted account'}</span>
                    </td>
                    <td className="num">{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                    <td className="num">{formatLKR(o.totalPrice)}</td>
                    <td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td>
                      <select
                        className="status-select"
                        aria-label={`Change status of order ${orderNumber(o._id)}`}
                        value={o.status}
                        disabled={o.status === 'Cancelled' || savingId === o._id}
                        onChange={(e) => changeStatus(o, e.target.value)}
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>

                  {openId === o._id && (
                    <tr className="order-details-row">
                      <td colSpan={7}>
                        <div className="order-details">
                          <div>
                            <h3>Items</h3>
                            <ul>
                              {o.items.map((i) => (
                                <li key={i._id}>
                                  {i.name} × {i.qty} · {i.colour} · Size {i.size} · {formatLKR(i.price * i.qty)}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3>Deliver to</h3>
                            <p>
                              {o.shippingAddress.fullName}<br />
                              {o.shippingAddress.address}<br />
                              {o.shippingAddress.city}, {o.shippingAddress.district}<br />
                              {o.shippingAddress.phone}
                            </p>
                          </div>
                          <div>
                            <h3>Payment</h3>
                            <p>
                              {o.paymentMethod}<br />
                              Subtotal {formatLKR(o.itemsPrice)}<br />
                              Delivery {o.shippingPrice === 0 ? 'Free' : formatLKR(o.shippingPrice)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;