import { useEffect, useState } from 'react';
import api, { errorMessage } from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import '../../styles/admin.css';

const EMPTY_SLIDE = {
  image: '', eyebrow: '', headline: '', text: '',
  buttonText: 'Shop now', buttonLink: '/collections/women', isActive: true,
};
const SUGGESTED_LINKS = ['/collections/women', '/collections/men', '/collections/accessories'];

const AdminHero = () => {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(EMPTY_SLIDE);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmId, setConfirmId] = useState(null); // which slide is asking "Delete?"

  const load = () =>
    api.get('/hero/all')
      .then(({ data }) => setSlides(data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_SLIDE);
  };

  const startEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      image: slide.image, eyebrow: slide.eyebrow, headline: slide.headline, text: slide.text,
      buttonText: slide.buttonText, buttonLink: slide.buttonLink, isActive: slide.isActive,
    });
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Upload one banner photo (shrunk to 2400px wide on the server)
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const body = new FormData();
    body.append('images', file);
    setUploading(true);
    setError('');
    try {
      const { data } = await api.post('/upload?type=hero', body);
      set('image', data.urls[0]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!form.image) {
      setError('Upload a photo for the slide.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) await api.put(`/hero/${editingId}`, form);
      else await api.post('/hero', form);
      setMessage(editingId ? 'Slide updated' : 'Slide added');
      resetForm();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (slide) => {
    setError('');
    try {
      await api.put(`/hero/${slide._id}`, { isActive: !slide.isActive });
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  // Swap a slide with the one above (-1) or below (+1)
  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
    try {
      const { data } = await api.put('/hero/reorder', { ids: next.map((s) => s._id) });
      setSlides(data);
    } catch (err) {
      setError(errorMessage(err));
      load();
    }
  };

  const remove = async (slide) => {
    setError('');
    try {
      await api.delete(`/hero/${slide._id}`);
      setConfirmId(null);
      if (editingId === slide._id) resetForm();
      setMessage('Slide deleted');
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <section className="wrap admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Hero slides</h1>
        </div>
      </div>

      <AdminNav />

      {message && <p className="admin-msg" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}

      {/* Add / edit form */}
      <form className="product-form" onSubmit={handleSubmit}>
        <fieldset className="form-section">
          <legend>{editingId ? 'Edit slide' : 'Add a slide'}</legend>

          {/* Live preview of how the slide will look */}
          <div className="hero-preview" style={form.image ? { backgroundImage: `url(${form.image})` } : undefined}>
            <div className="hero-preview-text">
              {form.eyebrow && <span className="eyebrow">{form.eyebrow}</span>}
              <strong>{form.headline || 'Your headline'}</strong>
              {form.text && <span>{form.text}</span>}
              <span className="hero-preview-btn">{form.buttonText || 'Shop now'}</span>
            </div>
            {!form.image && <span className="hero-preview-empty">Upload a photo to see the preview</span>}
          </div>

          <label className={`upload-box compact ${uploading ? 'busy' : ''}`}>
            <input type="file" disabled={uploading}
              accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFile} />
            <strong>{uploading ? 'Uploading…' : form.image ? 'Replace photo' : '+ Upload banner photo'}</strong>
            <span>Wide landscape photo, about 2400 × 1200 px. Keep the subject on the right half.</span>
          </label>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="eyebrow">Small label (optional)</label>
              <input id="eyebrow" value={form.eyebrow} placeholder="e.g. FW26 · New collection"
                onChange={(e) => set('eyebrow', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="headline">Headline</label>
              <input id="headline" value={form.headline} required placeholder="e.g. Built for the heat"
                onChange={(e) => set('headline', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="text">Text (optional)</label>
            <textarea id="text" value={form.text} placeholder="One or two short sentences"
              onChange={(e) => set('text', e.target.value)} />
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="buttonText">Button text</label>
              <input id="buttonText" value={form.buttonText} required
                onChange={(e) => set('buttonText', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="buttonLink">Button link</label>
              <input id="buttonLink" list="link-options" value={form.buttonLink} required
                onChange={(e) => set('buttonLink', e.target.value)} />
              <datalist id="link-options">
                {SUGGESTED_LINKS.map((l) => <option key={l} value={l} />)}
              </datalist>
              <span className="hint">A page on this site, e.g. /collections/men or /products/velocity-seamless-tee</span>
            </div>
          </div>

          <label className="check">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
            Show this slide on the home page
          </label>

          <div className="form-actions">
            <button className="btn ink" type="submit" disabled={saving || uploading}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add slide'}
            </button>
            {editingId && <button type="button" className="text-btn" onClick={resetForm}>Cancel editing</button>}
          </div>
        </fieldset>
      </form>

      {/* Existing slides */}
      <h2 className="slides-title">Slides ({slides.length})</h2>
      {loading && <p className="status-msg">Loading slides…</p>}
      {!loading && slides.length === 0 && (
        <p className="status-msg">No slides yet. The home page shows the standard hero until you add one.</p>
      )}

      <ol className="slide-list">
        {slides.map((s, i) => (
          <li key={s._id} className={`slide-row ${s.isActive ? '' : 'is-hidden'}`}>
            <img className="slide-thumb" src={s.image} alt="" />
            <div className="slide-info">
              {s.eyebrow && <span className="muted">{s.eyebrow}</span>}
              <strong>{s.headline}</strong>
              <span className="muted">{s.buttonText} → {s.buttonLink}</span>
              <span className={`pill ${s.isActive ? 'ok' : 'out'}`}>{s.isActive ? 'Showing' : 'Hidden'}</span>
            </div>
            <div className="row-actions">
              <button className="text-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button className="text-btn" onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Move down">↓</button>
              <button className="text-btn" onClick={() => toggleActive(s)}>{s.isActive ? 'Hide' : 'Show'}</button>
              <button className="text-btn" onClick={() => startEdit(s)}>Edit</button>
              {confirmId === s._id ? (
                <>
                  <button className="text-btn danger" onClick={() => remove(s)}>Yes, delete</button>
                  <button className="text-btn" onClick={() => setConfirmId(null)}>Cancel</button>
                </>
              ) : (
                <button className="text-btn danger" onClick={() => setConfirmId(s._id)}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default AdminHero;