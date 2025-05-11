
import { useState } from "react"
import { RVContext } from "../context/RVContext"
export const RVProvider = ({children})=>{
    const [RV, setRV] = useState(null)
    return (
        <RVContext.Provider value={{RV, setRV}}>
            {children}
        </RVContext.Provider>
    )
}