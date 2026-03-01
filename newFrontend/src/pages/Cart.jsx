import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAddresses, addAddress } from '../api/address';
import { createOrder } from '../api/orders';
import styles from './Cart.module.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeFromCart, clearCart, fetchCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    type: 'home'
  });

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data.addresses || []);
        const defaultAddr = (data.addresses || []).find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
        else if (data.addresses?.[0]) setSelectedAddressId(data.addresses[0]._id);
      } catch {
        setAddresses([]);
      }
    };
    loadAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const data = await addAddress(addressForm);
      setAddresses((prev) => [data.address, ...prev]);
      setSelectedAddressId(data.address._id);
      setShowAddressForm(false);
      setAddressForm({ street: '', city: '', state: '', pincode: '', country: 'India', type: 'home' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setOrderError('Please select or add a shipping address');
      return;
    }
    setOrderError('');
    setOrderLoading(true);
    try {
      await createOrder(selectedAddressId);
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price);

  const getItemImage = (item) => {
    const p = item.product;
    if (!p) return null;
    const imgs = p.images || p.image;
    if (Array.isArray(imgs) && imgs[0]?.url) return imgs[0].url;
    if (typeof imgs === 'string') return imgs;
    return null;
  };

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  if (loading && !cart) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate('/')} className={styles.backBtn}>
        ← Continue Shopping
      </button>
      <h1 className={styles.title}>Your Cart</h1>

      {isEmpty ? (
        <div className={styles.empty}>
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')} className={styles.shopBtn}>
            Shop Now
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.itemsSection}>
            {items.map((item) => {
              const product = typeof item.product === 'object' ? item.product || {} : {};
              const productId = product._id || item.product;
              return (
                <div key={productId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {getItemImage(item) ? (
                      <img src={getItemImage(item)} alt={product.name} />
                    ) : (
                      <div className={styles.imgPlaceholder}>No image</div>
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <h3
                      className={styles.itemName}
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      {product.name || 'Product'}
                    </h3>
                    <p className={styles.itemPrice}>{formatPrice(item.price)} each</p>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityCtrl}>
                        <button
                          onClick={() =>
                            updateCartItem(productId, Math.max(0, (item.quantity || 1) - 1))
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartItem(productId, (item.quantity || 1) + 1)
                          }
                          disabled={(item.quantity || 0) >= (product.stock ?? 999)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(productId)}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice((item.quantity || 0) * (item.price || 0))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.summary}>
              <h3>Order Summary</h3>
              <p>
                Items: <strong>{cart?.totalItems ?? items.reduce((s, i) => s + (i.quantity || 0), 0)}</strong>
              </p>
              <p className={styles.total}>
                Total: <strong>{formatPrice(cart?.totalPrice ?? items.reduce((s, i) => s + (i.quantity || 0) * (i.price || 0), 0))}</strong>
              </p>
            </div>

            <div className={styles.addressSection}>
              <h3>Shipping Address</h3>
              {addresses.length > 0 ? (
                <div className={styles.addressList}>
                  {addresses.map((addr) => (
                    <label key={addr._id} className={styles.addressOption}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                      />
                      <span>
                        {addr.street}, {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className={styles.noAddress}>No addresses yet. Add one below.</p>
              )}
              {!showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className={styles.addAddrBtn}
                >
                  + Add New Address
                </button>
              ) : (
                <form onSubmit={handleAddAddress} className={styles.addressForm}>
                  <input
                    placeholder="Street"
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, street: e.target.value }))
                    }
                    required
                  />
                  <input
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, city: e.target.value }))
                    }
                    required
                  />
                  <input
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, state: e.target.value }))
                    }
                  />
                  <input
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, pincode: e.target.value }))
                    }
                    required
                  />
                  <select
                    value={addressForm.type}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, type: e.target.value }))
                    }
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                  <div className={styles.formActions}>
                    <button type="submit">Save Address</button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {orderError && <p className={styles.orderError}>{orderError}</p>}
            <button
              onClick={handlePlaceOrder}
              disabled={orderLoading || !selectedAddressId}
              className={styles.placeOrderBtn}
            >
              {orderLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
