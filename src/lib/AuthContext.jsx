import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Simple localStorage-based auth (no external service needed)
const LOCAL_USER_KEY = 'physics_sandbox_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
    setIsLoadingAuth(false);
  }, []);

  const login = (userData) => {
    const u = { ...userData, id: userData.id || Date.now().toString() };
    setUser(u);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const isLoadingPublicSettings = false;
  const authError = null;
  const navigateToLogin = () => {};

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
