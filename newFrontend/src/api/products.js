import axios from './axios';

export const getProducts = async (params = {}) => {
  const { data } = await axios.get('/products', { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await axios.get(`/products/${id}`);
  return data;
};
