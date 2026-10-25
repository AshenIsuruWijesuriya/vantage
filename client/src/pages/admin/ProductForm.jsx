import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import '../../styles/admin.css';

const ACTIVITIES = ['lifting', 'running', 'rest-day', 'casual', 'pilates-yoga'];
const CATEGORIES = [
  'tees', 'tanks', 'joggers', 'shorts', 'jackets',
  'leggings', 'sports-bras', 'crop-tops', 'bags', 'bottles', 'caps',
];
const SIZE_PRESETS = {
  'Men S–XL': ['S', 'M', 'L', 'XL'],
  'Women XS–L': ['XS', 'S', 'M', 'L'],
  'One size': ['One size'],
};
const MAX_IMAGES = 8;

const EMPTY_FORM = {
  name: '', slug: '', description: '', gender: 'women', category: '',
  activities: [], price: '', compareAtPrice: '', badge: '',
  isFeatured: false,
  images: [],
  colours: [{ name: 'Black', hex: '#1a1c20' }],
  sizes: [],
};

// "Stride Mesh Jersey" → "stride-mesh-jersey"
const toSlug = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const ProductForm = () => {
  const { slug: editSlug } = useParams(); // present only when editing
  const isEdit = Boolean(editSlug);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [productId, setProductId] = useState(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // When editing, load the product and fill in the form
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${editSlug}`)
      .then(({ data }) => {
        setProductId(data._id);
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          gender: data.gender,
          category: data.category,
          activities: data.activities || [],
          price: String(data.price),
          compareAtPrice: data.compareAtPrice ? String(data.compareAtPrice) : '',
          badge: data.badge || '',
          isFeatured: Boolean(data.isFeatured),
          images: data.images || [],
          colours: data.colours.map(({ name, hex }) => ({ name, hex })),
          sizes: data.sizes.map(({ size, stock }) => ({ size, stock: String(stock) })),
        });
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [isEdit, editSlug]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  // Typing a name also fills in the slug, until the slug is edited by hand
  const handleName = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : toSlug(name) }));
  };

  const toggleActivity = (activity) =>
    set('activities', form.activities.includes(activity)
      ? form.activities.filter((a) => a !== activity)
      : [...form.activities, activity]);

  // Helpers for the colour and size lists
  const updateRow = (list, index, field, value) =>
    set(list, form[list].map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  const removeRow = (list, index) => set(list, form[list].filter((_, i) => i !== index));
  const addRow = (list, row) => set(list, [...form[list], row]);

  // Fill sizes from a preset, keeping stock for sizes already entered
  const applyPreset = (sizes) =>
    set('sizes', sizes.map((size) => form.sizes.find((s) => s.size === size) || { size, stock: '10' }));

  // ---- Images ----
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // lets you pick the same file again later
    if (files.length === 0) return;
    if (form.images.length + files.length > MAX_IMAGES) {
      setError(`A product can have up to ${MAX_IMAGES} images.`);
      return;
    }

    const body = new FormData();
    files.forEach((file) => body.append('images', file));

    setUploading(true);
    setError('');
    try {
      const { data } = await api.post('/upload', body);
      setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const makeMain = (index) =>
    set('images', [form.images[index], ...form.images.filter((_, i) => i !== index)]);
  const removeImage = (index) => set('images', form.images.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.colours.length === 0 || form.colours.some((c) => !c.name.trim())) {
      setError('Add at least one colour, and give every colour a name.');
      return;
    }
    if (form.sizes.length === 0 || form.sizes.some((s) => !s.size.trim())) {
      setError('Add at least one size.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: toSlug(form.slug),
      description: form.description.trim(),
      gender: form.gender,
      category: toSlug(form.category),
      activities: form.activities,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || 0,
      images: form.images,
      badge: form.badge.trim(),
      isFeatured: form.isFeatured,
      colours: form.colours.map((c) => ({ name: c.name.trim(), hex: c.hex })),
      sizes: form.sizes.map((s) => ({ size: s.size.trim(), stock: Math.max(0, Number(s.stock) || 0) })),
    };

    setSaving(true);
    try {
      if (isEdit) await api.put(`/products/${productId}`, payload);
      else await api.post('/products', payload);
      navigate('/admin/products');
    } catch (err) {
      setError(errorMessage(err)); // e.g. "That slug is already in use"
      setSaving(false);
    }
  };

  if (loading) return <p className="wrap status-msg">Loading product…</p>;

  return (
    <section className="wrap admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>{isEdit ? 'Edit product' : 'Add product'}</h1>
        </div>
      </div>

      <AdminNav />

      <form className="product-form" onSubmit={handleSubmit}>
        {/* Basic details */}
        <fieldset className="form-section">
          <legend>Details</legend>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" value={form.name} onChange={handleName} required />
            </div>
            <div className="field">
              <label htmlFor="slug">URL slug</label>
              <input
                id="slug" value={form.slug} required
                onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
              />
              <span className="hint">/products/{toSlug(form.slug) || 'your-product'}</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={form.description}
              onChange={(e) => set('description', e.target.value)} />
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Unisex (accessories)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <input id="category" list="category-options" value={form.category} required
                onChange={(e) => set('category', e.target.value)} />
              <datalist id="category-options">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Activities</span>
            <div className="check-row">
              {ACTIVITIES.map((a) => (
                <label key={a} className="check">
                  <input type="checkbox" checked={form.activities.includes(a)} onChange={() => toggleActivity(a)} />
                  {a.replace('-', ' ')}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Images */}
        <fieldset className="form-section">
          <legend>Images</legend>
          <p className="hint">
            The first image is the main photo on product cards and the product page.
            JPG, PNG or WebP, up to 5 MB each, up to {MAX_IMAGES} per product.
          </p>

          {form.images.length > 0 && (
            <ul className="image-grid">
              {form.images.map((url, i) => (
                <li key={`${url}-${i}`} className="image-tile">
                  <img src={url} alt={`Product image ${i + 1}`} />
                  <div className="tile-bar">
                    {i === 0 ? (
                      <span className="tile-main">Main</span>
                    ) : (
                      <button type="button" className="tile-btn" onClick={() => makeMain(i)}>Make main</button>
                    )}
                    <button type="button" className="tile-btn danger" onClick={() => removeImage(i)}
                      aria-label={`Remove image ${i + 1}`}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {form.images.length < MAX_IMAGES && (
            <label className={`upload-box ${uploading ? 'busy' : ''}`}>
              <input
                type="file" multiple disabled={uploading}
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFiles}
              />
              <strong>{uploading ? 'Uploading…' : '+ Upload images'}</strong>
              <span>{uploading ? 'Please wait' : 'Choose one or more photos from your computer'}</span>
            </label>
          )}
        </fieldset>

        {/* Price and display */}
        <fieldset className="form-section">
          <legend>Price and display</legend>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="price">Price (LKR)</label>
              <input id="price" type="number" min="0" step="50" value={form.price} required
                onChange={(e) => set('price', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="compareAtPrice">Was price (LKR)</label>
              <input id="compareAtPrice" type="number" min="0" step="50" value={form.compareAtPrice}
                onChange={(e) => set('compareAtPrice', e.target.value)} />
              <span className="hint">Fill in only for sale items. Must be higher than the price.</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="badge">Badge</label>
            <input id="badge" list="badge-options" value={form.badge} placeholder="e.g. New"
              onChange={(e) => set('badge', e.target.value)} />
            <datalist id="badge-options">
              <option value="New" />
              <option value="Best seller" />
              <option value="Limited" />
            </datalist>
          </div>

          <label className="check">
            <input type="checkbox" checked={form.isFeatured}
              onChange={(e) => set('isFeatured', e.target.checked)} />
            Show on the home page ("The latest styles")
          </label>
        </fieldset>

        {/* Colours */}
        <fieldset className="form-section">
          <legend>Colours</legend>
          <div className="row-list">
            {form.colours.map((c, i) => (
              <div key={i} className="edit-row">
                <input type="text" aria-label={`Colour ${i + 1} name`} placeholder="Colour name"
                  value={c.name} onChange={(e) => updateRow('colours', i, 'name', e.target.value)} />
                <input type="color" aria-label={`Colour ${i + 1} swatch`}
                  value={c.hex} onChange={(e) => updateRow('colours', i, 'hex', e.target.value)} />
                <button type="button" className="text-btn danger" onClick={() => removeRow('colours', i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div>
            <button type="button" className="chip" onClick={() => addRow('colours', { name: '', hex: '#888888' })}>
              + Add colour
            </button>
          </div>
        </fieldset>

        {/* Sizes and stock */}
        <fieldset className="form-section">
          <legend>Sizes and stock</legend>
          <div className="preset-row">
            <span className="hint">Quick fill:</span>
            {Object.entries(SIZE_PRESETS).map(([label, sizes]) => (
              <button key={label} type="button" className="chip" onClick={() => applyPreset(sizes)}>
                {label}
              </button>
            ))}
          </div>
          <div className="row-list">
            {form.sizes.map((s, i) => (
              <div key={i} className="edit-row size-row">
                <input type="text" aria-label={`Size ${i + 1}`} placeholder="Size"
                  value={s.size} onChange={(e) => updateRow('sizes', i, 'size', e.target.value)} />
                <input type="number" min="0" aria-label={`Stock for size ${s.size || i + 1}`} placeholder="Stock"
                  value={s.stock} onChange={(e) => updateRow('sizes', i, 'stock', e.target.value)} />
                <button type="button" className="text-btn danger" onClick={() => removeRow('sizes', i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div>
            <button type="button" className="chip" onClick={() => addRow('sizes', { size: '', stock: '0' })}>
              + Add size
            </button>
          </div>
        </fieldset>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button className="btn ink" type="submit" disabled={saving || uploading}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
          </button>
          <Link className="text-btn" to="/admin/products">Cancel</Link>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;