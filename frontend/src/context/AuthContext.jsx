import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage on mount
    const token = sessionStorage.getItem('token');
    const tenant_id = sessionStorage.getItem('tenant_id');
    const company_name = sessionStorage.getItem('company_name');

    if (token && tenant_id) {
      setUser({ token, tenant_id, company_name });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem('token', userData.token);
    sessionStorage.setItem('tenant_id', userData.tenant_id);
    sessionStorage.setItem('company_name', userData.company_name);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tenant_id');
    sessionStorage.removeItem('company_name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
