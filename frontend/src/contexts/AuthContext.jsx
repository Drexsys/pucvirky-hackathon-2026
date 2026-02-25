import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Перевіряємо, чи є збережений користувач
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    } else {
      // ТЕСТУВАННЯ: Автоматичний логін з захардкодованими даними
      const testUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(testUser);
      localStorage.setItem('user', JSON.stringify(testUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


