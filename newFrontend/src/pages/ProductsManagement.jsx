import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/products';
import { createProduct, updateProduct, deleteProduct } from '../api/admin';
import styles from './ProductsManagement.module.css';

export default function ProductsManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '0',
    category: 'electronics',
    brand: '',
    stock: ''
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      const data = await getProducts({ page: 1, limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discountPercentage: product.discountPercentage || '0',
      category: product.category || 'electronics',
      brand: product.brand || '',
      stock: product.stock || ''
    });
    setImages([]);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPercentage: '0',
      category: 'electronics',
      brand: '',
      stock: ''
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData, images);
      }
      await loadProducts();
      handleCancel();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);

  const getProductImage = (product) => {
    const imgs = product.images;
    if (imgs?.length > 0 && imgs[0]?.url) return imgs[0].url;
    return null;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <div className={styles.headerRow}>
          <h1>Products Management</h1>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            + Add Product
          </button>
        </div>
        <p className={styles.count}>Total: {products.length} products</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formCard}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="skincare">Skincare</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Discount %</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.field}>
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              {!editingProduct && (
                <div className={styles.field}>
                  <label>Images (max 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
              )}

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products found</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.productImage}>
                {getProductImage(product) ? (
                  <img src={getProductImage(product)} alt={product.name} />
                ) : (
                  <div className={styles.imgPlaceholder}>No image</div>
                )}
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.category}>{product.category}</p>
                <p className={styles.price}>{formatPrice(product.discountPrice ?? product.price)}</p>
                <p className={styles.stock}>Stock: {product.stock}</p>
              </div>
              <div className={styles.productActions}>
                <button onClick={() => handleEdit(product)} className={styles.editBtn}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  disabled={deletingId === product._id}
                  className={styles.deleteBtn}
                >
                  {deletingId === product._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
