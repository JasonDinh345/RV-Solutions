import { useState, useEffect } from "react"
import { useRV } from "../../../../hooks/useRV"
import MyRVInfo from "./MyRVInfo";

export default function MyRV({rvData}){
    const [statusColor, setStatusColor] = useState("green")
    const {RV, setRV} = useRV();
        useEffect(()=>{
            if(rvData.isAvailable){
                setStatusColor("green")
            }else{
                setStatusColor("red")
            }
        },[rvData.isAvailable])
    return(
         <>
         <tr>
            <td className="tableImage"><img src={rvData.imageURL} onClick={()=>{setRV(rvData)}}></img></td>
            <td>{rvData.Make}</td>
            <td>{rvData.Model}</td>
            <td>{rvData.SizeClass}</td>
            <td>{rvData.CostToRent}</td>
            <td style={{color:{statusColor}}}>{rvData.isAvailable}</td>
        </tr>
        {RV && 
            <>
            <MyRVInfo rvData={rvData}/>
            </>
        }
         </>
    )
}