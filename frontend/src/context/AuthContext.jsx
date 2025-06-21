import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const firstname = localStorage.getItem('userFirstname');
    const email = localStorage.getItem('userEmail');
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');

    if (token && id && email) {
      const loadedUser = {
        id: parseInt(id),
        firstname,
        email,
        token,
        roles,
      };
      setUser(loadedUser);
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          logout(); // Token invalide => suppression
        }
      } catch (err) {
        console.error('Erreur de validation du token :', err);
        logout();
      }
    };

    validateToken();
  }, []);


  // Log automatique dès que l'utilisateur change
  useEffect(() => {
    console.log('🧾 AuthContext - utilisateur actuel :', user);
  }, [user]);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userFirstname', userData.firstname);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRoles', JSON.stringify(userData.roles || []));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFirstname');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
