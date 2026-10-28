import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FREE_DELIVERY } from '../context/CartContext';
import { COLLECTIONS, categoryLabel } from '../utils/collections';
import { formatLKR } from '../utils/format';
import '../styles/home.css';

const FEATURED_LIMIT = 8; // two rows of four

const TICKER = ['Train hard', 'Recover easy', 'Wear it out', 'Built for Colombo heat', 'Designed in Sri Lanka'];

const PERKS = [
  { title: 'Free island-wide delivery', text: `On every order over ${formatLKR(FREE_DELIVERY)}.` },
  { title: 'Cash on delivery', text: 'Pay the courier in cash when your order arrives.' },
  { title: '7-day size exchanges', text: 'Wrong fit? Swap it for another size within a week.' },
  { title: 'Designed in Sri Lanka', text: 'Cut and tested for training in tropical heat.' },
];

// Grey stand-ins shown while the featured products load
const SkeletonCard = () => (
  <div className="card" aria-hidden="true">
    <div className="card-img skeleton" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-line short" />
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0); // bumped by "Try again"

  // Load featured products when the page opens, and again on "Try again"
  useEffect(() => {
    api.get('/products', { params: { featured: true } })
      .then(({ data }) => setProducts(data.products.slice(0, FEATURED_LIMIT)))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [attempt]);

  const retry = () => {
    setError('');
    setLoading(true);
    setAttempt((n) => n + 1);
  };

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="eyebrow">FW26 · Drop 02 · Out now</p>
            <h1>Earn your<br /><span className="out">Vantage</span></h1>
          </div>
          <div>
            <p>Performance and lifestyle wear cut for Colombo heat. Train hard, recover easy, wear it out after.</p>
            <div className="ctas">
              <Link className="btn solid" to="/collections/men">Shop Men</Link>
              <Link className="btn ghost" to="/collections/women">Shop Women</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative scrolling strip; the words repeat so the loop is seamless */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((text, i) => <span key={i}>{text}</span>)}
        </div>
      </div>

      <section className="wrap block" aria-labelledby="collections-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by collection</p>
            <h2 id="collections-heading">Find your kit</h2>
          </div>
        </div>

        <div className="collection-tiles">
          {Object.entries(COLLECTIONS).map(([key, c]) => (
            <Link key={key} to={`/collections/${key}`} className={`collection-tile ${key}`}>
              <h3>{c.title}</h3>
              <div>
                <p className="tile-intro">{c.intro}</p>
                <p className="tile-cats">{c.categories.map(categoryLabel).join(' · ')}</p>
                <span className="tile-cta">Shop {key} <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap block featured" aria-labelledby="featured-heading" aria-busy={loading}>
        <div className="section-head">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 id="featured-heading">The latest styles</h2>
          </div>
        </div>

        {loading && (
          <>
            <p className="sr-only" role="status">Loading products…</p>
            <div className="grid">
              {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {error && (
          <div className="load-error">
            <p className="form-error">Couldn't load products: {error}</p>
            <button className="btn ink" onClick={retry}>Try again</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="status-msg">No featured products yet.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      <section className="wrap perks-block" aria-label="Why shop with Vantage">
        <ol className="perk-list">
          {PERKS.map((perk) => (
            <li key={perk.title}>
              <h3>{perk.title}</h3>
              <p>{perk.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default HomePage;
