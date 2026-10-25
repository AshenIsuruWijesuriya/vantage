import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem('vantage-user')); } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);

  const save = (data) => {
    localStorage.setItem('vantage-user', JSON.stringify(data));
    setUser(data);
  };
  const login = async (email, password) =>
    save((await api.post('/users/login', { email, password })).data);
  const register = async (name, email, password) =>
    save((await api.post('/users/register', { name, email, password })).data);
  const logout = () => {
    localStorage.removeItem('vantage-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);