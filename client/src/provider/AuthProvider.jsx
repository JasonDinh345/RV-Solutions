import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
export const AuthProvider = ({ children }) => {

  const [account, setAccount] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const login = useCallback((accountData)=>{
        if(!account){
        setAccount(accountData)
        }
  },[account])
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
  }, [login]);

  
  const logout = async() => {
    try{
      const res = await axios.delete("http://localhost:1231/auth/logout",{
        withCredentials: true,
      })
      if(res.status === 204){
        setAccount(null)
      }
    }catch(err){
      console.error(err)
      alert("Failed to logout")
    }
  };

  return (
    <AuthContext.Provider value={{ account, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

