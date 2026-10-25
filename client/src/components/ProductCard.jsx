import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatLKR } from '../utils/format';

const ProductCard = ({ product }) => {
  const [colourIndex, setColourIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState({}); // photos that failed to load

  const colour = product.colours[colourIndex] || product.colours[0];
  // This colour's main photo. Older products keep photos on the product itself (first colour only).
  const image = colour?.images?.[0] || (colourIndex === 0 ? product.images[0] : '');
  const showImage = Boolean(image) && !brokenImages[image];
  const onSale = product.compareAtPrice > product.price;
  const link = `/products/${product.slug}?colour=${encodeURIComponent(colour?.name || '')}`;

  return (
    <article className="card">
      <Link to={link} className="card-img" style={{ background: colour?.hex || 'var(--line)' }}>
        {product.badge && <span className="badge">{product.badge}</span>}
        {onSale && <span className="badge sale">Sale</span>}
        {showImage ? (
          <img
            src={image}
            alt={`${product.name} in ${colour.name}`}
            loading="lazy"
            onError={() => setBrokenImages((b) => ({ ...b, [image]: true }))}
          />
        ) : (
          <span className="card-placeholder">{product.category.replace('-', ' ')}</span>
        )}
      </Link>

      <h3 className="card-name">
        <Link to={link}>{product.name}</Link>
      </h3>

      <div className="card-meta">
        <span>
          {colour?.name}
          {product.colours.length > 1 && ` · ${product.colours.length} colours`}
        </span>
        <span className="price">
          {onSale && <s>{formatLKR(product.compareAtPrice)}</s>}
          {formatLKR(product.price)}
        </span>
      </div>

      <div className="swatches">
        {product.colours.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={i === colourIndex ? 'active' : ''}
            style={{ background: c.hex }}
            title={c.name}
            aria-label={`Show ${product.name} in ${c.name}`}
            onMouseEnter={() => setColourIndex(i)}
            onFocus={() => setColourIndex(i)}
            onClick={() => setColourIndex(i)}
          />
        ))}
      </div>
    </article>
  );
};

export default ProductCard;