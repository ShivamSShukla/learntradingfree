import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getUser: () => api.get('/user'),
};

export const stockAPI = {
  getQuote: (symbol: string) => api.get(`/stocks/quote/${symbol}`),
  search: (query: string) => api.get(`/stocks/search/${query}`),
  getIndices: () => api.get('/stocks/indices'),
};

export const tradeAPI = {
  executeTrade: (data: { symbol: string; type: string; quantity: number; price: number }) =>
    api.post('/trade', data),
  getPortfolio: () => api.get('/portfolio'),
  getTrades: () => api.get('/trades'),
};

export default api;
