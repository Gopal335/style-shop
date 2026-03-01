import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../api/admin';
import styles from './UsersList.module.css';

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setError(null);
      const data = await getAllUsers();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1>Users Management</h1>
        <p className={styles.count}>Total: {users.length} users</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {users.length === 0 ? (
        <div className={styles.empty}>
          <p>No users found</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <span className={styles.role}>{user.role || 'user'}</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                      className={styles.deleteBtn}
                    >
                      {deletingId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
