import axios from './axios';

export const createOrder = async (addressId) => {
  const { data } = await axios.post('/orders', { addressId });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axios.get('/orders/me');
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axios.get(`/orders/${id}`);
  return data;
};
