import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api', // Your local backend
});

export const fetchProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/products', data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
