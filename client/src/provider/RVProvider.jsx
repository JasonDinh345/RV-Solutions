
import { useState, useCallback } from "react"
import { RVContext } from "../context/RVContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export const RVProvider = ({children})=>{
    const [RV, setRV] = useState(null)
    const navigate = useNavigate();
    const handleSetRV = useCallback(async (VIN) => {
    if (!VIN) {
      setRV(null);
      navigate(`/accountInfo/RVs`);
      return;
    }

    try {
      const result = await axios.get(`http://localhost:1231/RV/${VIN}`);
      if (result.data) {
        setRV(result.data);

        
      }
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);
    return (
        <RVContext.Provider value={{RV, handleSetRV}}>
            {children}
        </RVContext.Provider>
    )
}