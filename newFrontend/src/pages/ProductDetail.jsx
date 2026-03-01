import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/products';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product || product.stock < 1) return;
    setAdding(true);
    const result = await addToCart(product._id, Math.min(quantity, product.stock));
    setAdding(false);
    if (!result.success) {
      alert(result.message);
    } else {
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.error}>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || null;

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate('/')} className={styles.backBtn}>
        ← Back to products
      </button>
      <div className={styles.content}>
        <div className={styles.imageSection}>
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No image</div>
          )}
        </div>
        <div className={styles.details}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {formatPrice(product.discountPrice ?? product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className={styles.originalPrice}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.brand && (
            <p className={styles.brand}>Brand: {product.brand}</p>
          )}
          <p className={styles.stock}>
            {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
          </p>
          {user && product.stock > 0 && (
            <div className={styles.addToCartSection}>
              <div className={styles.quantityRow}>
                <label>Quantity:</label>
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(product.stock, +e.target.value || 1)))
                  }
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={styles.addToCartBtn}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
