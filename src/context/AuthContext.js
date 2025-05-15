import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurar interceptor para incluir o token em todas as requisições
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/api/users/user-info/', {
            headers: { Authorization: `Token ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          console.error("Erro ao verificar autenticação:", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:8000/api/users/login/', credentials);
      const { token: newToken, ...userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return true;
    } catch (err) {
      console.error("Erro de login:", err);
      setError(err.response?.data?.non_field_errors?.[0] || 'Erro ao fazer login. Verifique suas credenciais.');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:8000/api/users/register/', userData);
      const { token: newToken, ...newUserData } = response.data;
      
      setToken(newToken);
      setUser(newUserData);
      localStorage.setItem('token', newToken);
      
      return true;
    } catch (err) {
      console.error("Erro de registro:", err);
      setError(err.response?.data || 'Erro ao registrar usuário. Tente novamente.');
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8000/api/users/logout/', {}, {
          headers: { Authorization: `Token ${token}` }
        });
      }
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;