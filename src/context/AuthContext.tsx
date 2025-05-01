import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthStatus: () => void;
  logout: () => void;
}

// Nilai default untuk context
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuthStatus: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Memeriksa status autentikasi saat aplikasi dimuat
  const checkAuthStatus = () => {
    const token = Cookies.get("token");
    const isLoggedIn = Cookies.get("is_logged_in");

    if (token && isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  };

  // Fungsi untuk logout
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("is_logged_in");
    setIsAuthenticated(false);
  };

  // Periksa status autentikasi saat komponen dimount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    // Tampilkan loader atau spinner saat memeriksa status autentikasi
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuthStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
