import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const login = (accountData) => {
    console.log(accountData)
    setAccount(accountData)
  };
  const logout = () => setAccount(null);

  return (
    <AuthContext.Provider value={{ account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth, AuthContext };