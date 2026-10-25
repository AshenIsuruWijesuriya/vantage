import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/axios';

const RegisterPage = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go home.
  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check in the browser first, so the customer gets instant feedback
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err)); // e.g. "An account with this email already exists"
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="wrap auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="intro">Check out faster and track your Vantage orders.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name" name="name" type="text" autoComplete="name"
              value={form.name} onChange={handleChange} required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email"
              value={form.email} onChange={handleChange} required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" autoComplete="new-password"
              value={form.password} onChange={handleChange} required
            />
            <span className="hint">At least 8 characters.</span>
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm" name="confirm" type="password" autoComplete="new-password"
              value={form.confirm} onChange={handleChange} required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn ink" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;