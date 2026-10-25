import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, lineKey, FREE_DELIVERY } from '../context/CartContext';
import { formatLKR } from '../utils/format';
import '../styles/cart.css';

// One row in the bag
const CartLine = ({ item }) => {
  const { updateQty, removeItem } = useCart();
  const [hasImage, setHasImage] = useState(Boolean(item.image));
  const key = lineKey(item);

  return (
    <li className="cart-line">
      <Link
        to={`/products/${item.slug}`}
        className="cart-thumb"
        style={{ background: item.colourHex || 'var(--line)' }}
        aria-label={item.name}
      >
        {hasImage && <img src={item.image} alt="" onError={() => setHasImage(false)} />}
      </Link>

      <div className="cart-line-info">
        <h2><Link to={`/products/${item.slug}`}>{item.name}</Link></h2>
        <p className="meta">{item.colour} · Size {item.size}</p>
        <p className="meta">{formatLKR(item.price)} each</p>

        <div className="qty" aria-label={`Quantity of ${item.name}`}>
          <button onClick={() => updateQty(key, item.qty - 1)} aria-label="Decrease quantity">−</button>
          <span>{item.qty}</span>
          <button
            onClick={() => updateQty(key, item.qty + 1)}
            disabled={item.qty >= item.maxQty}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-line-end">
        <strong className="price">{formatLKR(item.price * item.qty)}</strong>
        <button className="remove-btn" onClick={() => removeItem(key)}>Remove</button>
      </div>
    </li>
  );
};

const CartPage = () => {
  const { items, count, subtotal, shipping } = useCart();

  if (items.length === 0) {
    return (
      <section className="wrap page-message">
        <h1>Your bag is empty</h1>
        <p>Pick a size on any product to add it here.</p>
        <Link className="btn ink" to="/collections/women">Start shopping</Link>
      </section>
    );
  }

  const toFree = FREE_DELIVERY - subtotal;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY) * 100);

  return (
    <section className="wrap cart-page">
      <h1>Your bag ({count})</h1>

      <div className="cart-layout">
        <ul className="cart-lines">
          {items.map((item) => <CartLine key={lineKey(item)} item={item} />)}
        </ul>

        <aside className="cart-summary" aria-label="Order summary">
          <h2>Summary</h2>

          <div>
            <p className="ship-progress">
              {toFree > 0
                ? `Add ${formatLKR(toFree)} more for free delivery`
                : "You've unlocked free island-wide delivery"}
            </p>
            <div className="ship-bar"><i style={{ width: `${progress}%` }} /></div>
          </div>

          <div className="summary-row"><span>Subtotal</span><span>{formatLKR(subtotal)}</span></div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{shipping === 0 ? 'Free' : formatLKR(shipping)}</span>
          </div>
          <div className="summary-row total"><span>Total</span><span>{formatLKR(subtotal + shipping)}</span></div>

          <Link className="btn ink" to="/checkout">Check out</Link>
          <p className="note">Tax included. Cash on delivery.</p>
        </aside>
      </div>
    </section>
  );
};

export default CartPage;