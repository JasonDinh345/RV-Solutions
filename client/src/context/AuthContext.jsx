import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const login = (accountData) => {
    if(!account){
      setAccount(accountData)
    }
  };
  useEffect(() => {
    const getUser = async () => {
      setAuthLoading(true)
      try {
        const res = await axios.get("http://localhost:1231/account/protected", {
          withCredentials: true,
        });
  
        if (res.status === 200) {
          login(res.data); // Save user data to context
        }
      } catch (err) {
        if (err.response?.status === 403) {
          try {
            const tokenRes = await axios.post("http://localhost:1231/auth/token",{}, {
              withCredentials: true,
            });
  
            if (tokenRes.status === 201) {
              // Try again after refreshing token
              await getUser();
            }
          } catch (tokenErr) {
            console.error('Response:', err.response);
            console.error('Status Code:', err.response.status);
            console.error('Data:', err.response.data);
            console.error("Token refresh failed:", tokenErr);
          }
        } else {
          console.error("User fetch failed:", err);
        }
      } finally{
        setAuthLoading(false)
      }
    };
  
    getUser();
  }, []);

  
  const logout = () => setAccount(null);

  return (
    <AuthContext.Provider value={{ account, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth, AuthContext };