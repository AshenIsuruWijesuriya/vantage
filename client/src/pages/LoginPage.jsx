import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/axios';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Where to go after logging in: back to the page that sent them here, or home
  const redirectTo = location.state?.from?.pathname || '/';

  // Already logged in? Skip this page.
  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="wrap auth-page">
      <div className="auth-card">
        <h1>Log in</h1>
        <p className="intro">Welcome back. Log in to check out and see your orders.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              id="password" name="password" type="password" autoComplete="current-password"
              value={form.password} onChange={handleChange} required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn ink" type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Vantage? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
  
};

export default LoginPage;