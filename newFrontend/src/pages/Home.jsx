import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/products';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsError(null);
        const data = await getProducts({ page: 1, limit: 20 });
        setProducts(data.products || []);
      } catch (err) {
        setProductsError(err.response?.data?.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductImage = (product) => {
    const images = product.images;
    if (images?.length > 0 && images[0]?.url) return images[0].url;
    return null;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingId(productId);
    const result = await addToCart(productId, 1);
    setAddingId(null);
    if (!result.success) {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.hero}>
      <div className={styles.bgPattern} aria-hidden="true" />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <h1 className={styles.title}>
            Discover your next
            <span className={styles.highlight}> favorite</span>
            <br />thing.
          </h1>
          <p className={styles.subtitle}>
            Shop thousands of products with style. Create an account to get started
            and unlock exclusive deals.
          </p>
          {!user && (
            <div className={styles.ctaGroup}>
              <button
                onClick={() => navigate('/signup')}
                className={styles.primaryCta}
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className={styles.secondaryCta}
              >
                I already have an account
              </button>
            </div>
          )}
        </section>

        <section className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>All Products</h2>
          {productsLoading ? (
            <div className={styles.productsLoading}>
              <div className={styles.spinner} />
              <p>Loading products...</p>
            </div>
          ) : productsError ? (
            <div className={styles.productsError}>
              <p>{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No products yet. Check back soon!</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <article
                  key={product._id}
                  className={styles.productCard}
                  onClick={() => navigate(`/products/${product._id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/products/${product._id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.productImageWrap}>
                    {getProductImage(product) ? (
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.productPlaceholder}>
                        No image
                      </div>
                    )}
                    {product.discountPercentage > 0 && (
                      <span className={styles.badge}>
                        -{product.discountPercentage}%
                      </span>
                    )}
                    {user && product.stock > 0 && (
                      <button
                        className={styles.addToCartBtn}
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={addingId === product._id}
                        type="button"
                      >
                        {addingId === product._id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productCategory}>{product.category}</p>
                    <div className={styles.productPriceRow}>
                      <span className={styles.productPrice}>
                        {formatPrice(product.discountPrice ?? product.price)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className={styles.originalPrice}>
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
