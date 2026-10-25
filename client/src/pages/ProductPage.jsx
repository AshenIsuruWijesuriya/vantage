import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import { useCart, FREE_DELIVERY } from '../context/CartContext';
import { formatLKR } from '../utils/format';
import '../styles/product.css';

// Which collection page the breadcrumb links back to
const collectionFor = (gender) => (gender === 'unisex' ? 'accessories' : gender);

const ProductPage = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [hasImage, setHasImage] = useState(true);

  // Load the product whenever the URL slug changes
  useEffect(() => {
    setProduct(null);
    setError('');
    setAdded(false);
    setHasImage(true);
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        setColour(data.colours[0]?.name || '');
        // One-size items (bags, bottles, caps) are pre-selected
        setSize(data.sizes.length === 1 ? data.sizes[0].size : '');
      })
      .catch((err) => setError(errorMessage(err)));
  }, [slug]);

  if (error) {
    return (
      <section className="wrap page-message">
        <h1>Product not found</h1>
        <p>{error}</p>
        <Link className="btn ink" to="/">Back to home</Link>
      </section>
    );
  }

  if (!product) return <p className="wrap status-msg">Loading product…</p>;

  const selectedColour = product.colours.find((c) => c.name === colour);
  const chosenSize = product.sizes.find((s) => s.size === size);
  const onSale = product.compareAtPrice > product.price;
  const collection = collectionFor(product.gender);

  const handleAdd = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || '',
      colourHex: selectedColour?.hex || '',
      price: product.price,
      colour,
      size,
      qty: 1,
      maxQty: chosenSize.stock,
    });
    setAdded(true);
  };

  return (
    <section className="wrap product-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> /
        <Link to={`/collections/${collection}`}>{collection}</Link> /
        <span>{product.name}</span>
      </nav>

      <div className="product-layout">
        {/* Image, or a panel in the selected colour until photos are added */}
        <div className="product-media" style={{ background: selectedColour?.hex || 'var(--line)' }}>
          {product.badge && <span className="badge">{product.badge}</span>}
          {onSale && <span className="badge sale">Sale</span>}
          {hasImage ? (
            <img src={product.images[0]} alt={product.name} onError={() => setHasImage(false)} />
          ) : (
            <span className="card-placeholder">{product.category.replace('-', ' ')}</span>
          )}
        </div>

        <div className="product-info">
          <div>
            <p className="eyebrow">{product.category.replace('-', ' ')}</p>
            <h1>{product.name}</h1>
          </div>

          <p className="product-price">
            {onSale && <s>{formatLKR(product.compareAtPrice)}</s>}
            {formatLKR(product.price)}
          </p>

          <p className="product-desc">{product.description}</p>

          {/* Colour */}
          <div>
            <p className="option-label">Colour <span>{colour}</span></p>
            <div className="colour-options">
              {product.colours.map((c) => (
                <button
                  key={c.name}
                  className="colour-btn"
                  style={{ background: c.hex }}
                  aria-label={c.name}
                  aria-pressed={c.name === colour}
                  onClick={() => { setColour(c.name); setAdded(false); }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="option-label">Size {chosenSize && <span>{chosenSize.size}</span>}</p>
            <div className="size-options">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  className="size-btn"
                  disabled={s.stock === 0}
                  aria-pressed={s.size === size}
                  onClick={() => { setSize(s.size); setAdded(false); }}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {chosenSize && chosenSize.stock <= 5 && (
              <p className="stock-note">Only {chosenSize.stock} left in this size</p>
            )}
          </div>

          <button className="btn ink add-btn" disabled={!chosenSize} onClick={handleAdd}>
            {chosenSize ? 'Add to bag' : 'Select a size'}
          </button>

          {added && (
            <p className="added-msg" role="status">
              Added to your bag
              <Link to="/cart">View bag →</Link>
            </p>
          )}

          <ul className="perks">
            <li>Free island-wide delivery on orders over {formatLKR(FREE_DELIVERY)}</li>
            <li>Cash on delivery available</li>
            <li>7-day size exchanges</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;