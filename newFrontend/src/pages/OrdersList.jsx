import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../api/admin';
import styles from './OrdersList.module.css';

export default function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setError(null);
      const data = await getAllOrders();
      setOrders(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1>Orders Management</h1>
        <p className={styles.count}>Total: {orders.length} orders</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p>No orders found</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>Order #{order._id?.slice(-8)}</span>
                  <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <div className={styles.orderMeta}>
                  <span className={styles.customer}>
                    {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})
                  </span>
                </div>
              </div>

              <div className={styles.orderItems}>
                <h4>Items:</h4>
                {order.items?.map((item, idx) => (
                  <div key={idx} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>×{item.quantity}</span>
                    <span className={styles.itemPrice}>
                      {formatPrice((item.price || 0) * (item.quantity || 0))}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.total}>
                  <strong>Total: {formatPrice(order.totalPrice)}</strong>
                </div>
                <div className={styles.statusSection}>
                  <label>Status:</label>
                  <select
                    value={order.status || 'Pending'}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className={styles.statusSelect}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  {updatingId === order._id && (
                    <span className={styles.updating}>Updating...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
