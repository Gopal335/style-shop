import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import styles from './Orders.module.css';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

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
      day: 'numeric'
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
      <button onClick={() => navigate('/')} className={styles.backBtn}>
        ← Back to Home
      </button>
      <h1 className={styles.title}>My Orders</h1>

      {error && <p className={styles.error}>{error}</p>}

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven&apos;t placed any orders yet</p>
          <button onClick={() => navigate('/')} className={styles.shopBtn}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>Order #{order._id?.slice(-8)}</span>
                  <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <span className={`${styles.status} ${styles[`status_${order.status?.toLowerCase()}`]}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <div className={styles.orderItems}>
                {order.items?.map((item, idx) => (
                  <div key={idx} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>×{item.quantity}</span>
                    <span className={styles.itemPrice}>{formatPrice((item.price || 0) * (item.quantity || 0))}</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <strong>Total: {formatPrice(order.totalPrice)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
