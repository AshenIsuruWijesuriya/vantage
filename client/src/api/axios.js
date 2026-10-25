import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach the login token to every request
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('vantage-user'));
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch { /* no saved user */ }
  return config;
});

export const errorMessage = (err) => err.response?.data?.message || err.message;
export default api;