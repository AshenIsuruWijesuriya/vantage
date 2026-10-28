import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import { formatLKR } from '../../utils/format';
import '../../styles/admin.css';

const totalStock = (p) => p.sizes.reduce((sum, s) => sum + s.stock, 0);

const stockPill = (p) => {
  const total = totalStock(p);
  if (total === 0) return <span className="pill out">Sold out</span>;
  if (p.sizes.some((s) => s.stock === 0)) return <span className="pill low">Sizes out</span>;
  if (total <= 10) return <span className="pill low">Low</span>;
  return <span className="pill ok">In stock</span>;
};

const AdminProducts = () => {
  const [data, setData] = useState({ products: [], page: 1, pages: 1, count: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmId, setConfirmId] = useState(null); // which row is asking "Delete?"

  const load = (pageNo) => {
    setLoading(true);
    api.get('/products', { params: { page: pageNo } })
      .then(({ data }) => {
        // Deleted the last product on the last page? Step back a page.
        if (data.products.length === 0 && pageNo > 1) setPage(pageNo - 1);
        else setData(data);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const handleDelete = async (product) => {
    setError('');
    try {
      await api.delete(`/products/${product._id}`);
      setMessage(`Deleted ${product.name}`);
      setConfirmId(null);
      load(page);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <section className="wrap admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Products</h1>
        </div>
        <Link className="btn ink" to="/admin/products/new">+ Add product</Link>
      </div>

      <AdminNav />

      {message && <p className="admin-msg" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading && <p className="status-msg">Loading products…</p>}

      {!loading && (
        <>
          <p className="result-count">{data.count} products</p>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Gender</th>
                  <th>Category</th>
                  <th className="num">Price</th>
                  <th className="num">Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <span className="swatch-box" style={{ background: p.colours[0]?.hex || 'var(--line)' }} />
                        <span>
                          <strong>{p.name}</strong>
                          <span className="muted">{p.slug}</span>
                        </span>
                      </div>
                    </td>
                    <td className="muted">{p.gender}</td>
                    <td className="muted">{p.category}</td>
                    <td className="num">{formatLKR(p.price)}</td>
                    <td className="num">{totalStock(p)}</td>
                    <td>{stockPill(p)}</td>
                    <td>{p.isFeatured && <span className="pill yes">Yes</span>}</td>
                    <td>
                      <div className="row-actions">
                        {confirmId === p._id ? (
                          <>
                            <span className="confirm-text">Delete?</span>
                            <button className="text-btn danger" onClick={() => handleDelete(p)}>Yes, delete</button>
                            <button className="text-btn" onClick={() => setConfirmId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <Link className="text-btn" to={`/admin/products/${p.slug}/edit`}>Edit</Link>
                            <button className="text-btn danger" onClick={() => setConfirmId(p._id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="pager">
              <button className="btn ink" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {data.pages}</span>
              <button className="btn ink" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AdminProducts;