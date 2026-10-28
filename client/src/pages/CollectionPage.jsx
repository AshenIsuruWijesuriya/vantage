import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api, { errorMessage } from '../api/axios';
import ProductCard from '../components/ProductCard';
import { COLLECTIONS, categoryLabel as label } from '../utils/collections';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const CollectionPage = () => {
  const { gender } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const collection = COLLECTIONS[gender];
  const [data, setData] = useState({ products: [], pages: 1, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reload whenever the collection, filter, sort or page changes
  useEffect(() => {
    if (!collection) return;
    setLoading(true);
    setError('');
    api.get('/products', {
      params: {
        gender: collection.apiGender,
        category: category || undefined,
        sort,
        page,
      },
    })
      .then(({ data }) => setData(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [collection, category, sort, page]);

  // Change one URL setting and keep the others (e.g. ?category=tees&sort=price-asc)
  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page'); // new filter → back to page 1
    setSearchParams(next);
  };

  if (!collection) {
    return (
      <section className="wrap page-message">
        <h1>Collection not found</h1>
        <p>Try Women, Men or Accessories.</p>
        <Link className="btn ink" to="/">Back to home</Link>
      </section>
    );
  }

  return (
    <section className="wrap block">
      <div className="collection-head">
        <p className="eyebrow">Shop</p>
        <h1>{collection.title}</h1>
        <p className="collection-intro">{collection.intro}</p>
      </div>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by category">
          <button
            className={`chip ${category === '' ? 'active' : ''}`}
            onClick={() => update('category', '')}
          >
            All
          </button>
          {collection.categories.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => update('category', c)}
            >
              {label(c)}
            </button>
          ))}
        </div>

        <label className="sort">
          <span>Sort</span>
          <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value)}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {!loading && !error && (
        <p className="result-count">
          {data.count} {data.count === 1 ? 'product' : 'products'}
        </p>
      )}

      {loading && <p className="status-msg">Loading products…</p>}
      {error && <p className="form-error">Couldn't load products: {error}</p>}
      {!loading && !error && data.count === 0 && (
        <p className="status-msg">Nothing here yet. Try another category.</p>
      )}

      <div className="grid">
        {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>

      {data.pages > 1 && (
        <div className="pager">
          <button className="btn ink" disabled={page <= 1} onClick={() => update('page', String(page - 1))}>
            Previous
          </button>
          <span>Page {page} of {data.pages}</span>
          <button className="btn ink" disabled={page >= data.pages} onClick={() => update('page', String(page + 1))}>
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default CollectionPage;