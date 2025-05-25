import { useState } from "react";
import { useRV } from "../../../../../hooks/useRV"
import DamageReportTable from "../../../components/DamageReportTable"
import { AddDamageReportForm } from "../../../components/DamageReportForm";
export default function RVDamagesInfo(){
    const [isAdding, setIsAdding] = useState(false)
    const {RV} = useRV();
    return(
        <>
        <div style={{height:"100%"}}>
             <DamageReportTable URL={`http://localhost:1231/damageReport/RV/${RV.VIN}`}/>
        </div>
        <div className="tableFooter">
            <button onClick={()=>setIsAdding(true)}>Add Damages</button>
        </div>
        {isAdding &&
            <AddDamageReportForm/>
        }
        </>
    )
}