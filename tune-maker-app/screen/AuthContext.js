import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (newToken) => {
    setToken(newToken);
    await AsyncStorage.clear;
    await AsyncStorage.setItem('userToken', newToken); 
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('userToken'); 
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
