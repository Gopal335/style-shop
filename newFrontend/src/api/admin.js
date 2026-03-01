import axios from './axios';

// Users
export const getAllUsers = async () => {
  const { data } = await axios.get('/users');
  return data;
};

export const getUserById = async (id) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await axios.post('/users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await axios.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`/users/${id}`);
  return data;
};

// Orders (Admin)
export const getAllOrders = async () => {
  const { data } = await axios.get('/orders');
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await axios.put(`/orders/${orderId}/status`, { status });
  return data;
};

// Products (Admin)
export const createProduct = async (productData, images) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  });
  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }
  const { data } = await axios.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await axios.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`/products/${id}`);
  return data;
};
