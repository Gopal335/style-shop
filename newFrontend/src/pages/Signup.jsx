import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim() || !form.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role === 'vendor' ? 'admin' : 'user'
      };

      const res = await axios.post('/auth/signup', payload);

      if (res.data.success && res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        await fetchProfile();
        navigate('/');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>
          ← Back to home
        </Link>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>
          Join us and start shopping with style
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="user">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
