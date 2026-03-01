import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchProfile, user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/auth/signin', {
        email: form.email.trim(),
        password: form.password
      });

      if (res.data.success && res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        await fetchProfile();
        // Check role after profile is fetched
        const profileRes = await axios.get('/auth/me');
        if (profileRes.data.data?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('Admin access only. Please use regular login.');
          localStorage.removeItem('token');
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password. Please try again.';
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
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>
          Sign in to access the admin panel
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>

        <p className={styles.footer}>
          <Link to="/login" className={styles.link}>
            Regular user login
          </Link>
        </p>
      </div>
    </div>
  );
}
