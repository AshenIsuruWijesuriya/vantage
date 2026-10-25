import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatLKR } from '../utils/format';

const ProductCard = ({ product }) => {
  // Until real photos are added, show a colour panel instead of a broken image
  const [hasImage, setHasImage] = useState(true);
  const mainColour = product.colours[0];
  const onSale = product.compareAtPrice > product.price;

  return (
    <article className="card">
      <Link
        to={`/products/${product.slug}`}
        className="card-img"
        style={{ background: mainColour?.hex || 'var(--line)' }}
      >
        {product.badge && <span className="badge">{product.badge}</span>}
        {onSale && <span className="badge sale">Sale</span>}
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setHasImage(false)}
          />
        ) : (
          <span className="card-placeholder">{product.category.replace('-', ' ')}</span>
        )}
      </Link>

      <h3 className="card-name">
        <Link to={`/products/${product.slug}`}>{product.name}</Link>
      </h3>

      <div className="card-meta">
        <span>
          {mainColour?.name}
          {product.colours.length > 1 && ` · ${product.colours.length} colours`}
        </span>
        <span className="price">
          {onSale && <s>{formatLKR(product.compareAtPrice)}</s>}
          {formatLKR(product.price)}
        </span>
      </div>

      <div className="swatches">
        {product.colours.map((c) => (
          <i key={c.name} style={{ background: c.hex }} title={c.name} />
        ))}
      </div>
    </article>
  );
};

export default ProductCard;