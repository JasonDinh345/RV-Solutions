import { useState, useEffect } from "react"

import { useRV } from "../../../../hooks/useRV";

export default function MyRV({rvData}){
    const [statusColor, setStatusColor] = useState("green")
    const {handleSetRV} = useRV();
    
    useEffect(()=>{
        if(rvData.isAvailable === 1){
            setStatusColor("green")
        }else{
            setStatusColor("red")
        }
    },[rvData.isAvailable])
    
    return(
         <>
         <tr>
            <td className="tableImage"><img src={rvData.ImageURL} onClick={()=>handleSetRV(rvData.VIN)}></img></td>
            <td>{rvData.Make}</td>
            <td>{rvData.Model}</td>
            <td>{rvData.SizeClass}</td>
            <td>{rvData.CostToRent}</td>
            <td style={{color:statusColor}}>{statusColor === "green" ? "Yes" : "No"}</td>
        </tr>
         </>
    )
}