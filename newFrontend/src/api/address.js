import axios from './axios';

export const getAddresses = async () => {
  const { data } = await axios.get('/address');
  return data;
};

export const addAddress = async (addressData) => {
  const { data } = await axios.post('/address', addressData);
  return data;
};

export const updateAddress = async (id, addressData) => {
  const { data } = await axios.put(`/address/${id}`, addressData);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await axios.delete(`/address/${id}`);
  return data;
};
