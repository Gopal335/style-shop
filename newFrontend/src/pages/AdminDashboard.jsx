import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.headerActions}>
          <span className={styles.welcome}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <div
            className={styles.card}
            onClick={() => navigate('/admin/users')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/admin/users')}
          >
            <h2>Users</h2>
            <p>View and manage all users</p>
          </div>

          <div
            className={styles.card}
            onClick={() => navigate('/admin/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/admin/orders')}
          >
            <h2>Orders</h2>
            <p>View all orders and manage order status</p>
          </div>

          <div
            className={styles.card}
            onClick={() => navigate('/admin/products')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/admin/products')}
          >
            <h2>Products</h2>
            <p>Add, edit, and delete products</p>
          </div>
        </div>
      </main>
    </div>
  );
}
