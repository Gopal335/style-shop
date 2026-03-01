import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Layout.module.css';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const isHome = location.pathname === '/';

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button
          onClick={() => navigate('/')}
          className={styles.logoBtn}
          type="button"
        >
          Shop<span>Style</span>
        </button>
        <nav className={styles.nav}>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className={styles.navBtn}
                >
                  Admin Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/cart')}
                    className={styles.navBtn}
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className={styles.badge}>{cartCount}</span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/orders')}
                    className={styles.navBtn}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={styles.navBtn}
                  >
                    Dashboard
                  </button>
                </>
              )}
              <span className={styles.userName}>{user.name}</span>
              <button
                onClick={logout}
                className={styles.logoutBtn}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className={styles.loginBtn}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={styles.signupBtn}
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className={styles.adminBtn}
              >
                Admin
              </button>
            </>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© 2025 ShopStyle. All rights reserved.</p>
      </footer>
    </div>
  );
}
