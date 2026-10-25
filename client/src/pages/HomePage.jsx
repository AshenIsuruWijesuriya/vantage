import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load featured products once, when the page opens
  useEffect(() => {
    api.get('/products', { params: { featured: true } })
      .then(({ data }) => setProducts(data.products))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

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

      <section className="wrap block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2>The latest styles</h2>
          </div>
          <Link className="link-arrow" to="/collections/women">Shop all →</Link>
        </div>

        {loading && <p className="status-msg">Loading products…</p>}
        {error && <p className="form-error">Couldn't load products: {error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="status-msg">No featured products yet.</p>
        )}

        <div className="grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </>
  );
};

export default HomePage;