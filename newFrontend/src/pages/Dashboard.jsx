import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.logo}>
          Shop<span>Style</span>
        </button>
        <div className={styles.actions}>
          <span className={styles.userName}>{user?.name || 'User'}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h1>Dashboard</h1>
        <p className={styles.welcome}>
          Welcome back, <strong>{user?.name}</strong>!
        </p>
        <p className={styles.info}>
          You are logged in as <strong>{user?.role || 'user'}</strong>.
        </p>
      </main>
    </div>
  );
}
