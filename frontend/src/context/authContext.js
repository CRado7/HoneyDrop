// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeToken, getToken, clearToken } from '@/utils/auth';
import { fetchCurrentUser, loginUser, registerUser } from '@/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial load
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await fetchCurrentUser();
        setUser(me);
      } catch (err) {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (input) => {
    try {
      setLoading(true);
      const { token, user } = await loginUser(input);
      storeToken(token);
      setUser(user);
      setError(null);
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (input) => {
    try {
      setLoading(true);
      const { token, user } = await registerUser(input);
      storeToken(token);
      setUser(user);
      setError(null);
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
