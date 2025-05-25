import { useState } from "react";
import { useRV } from "../../../../../hooks/useRV"
import DamageReportTable from "../../../components/DamageReportTable"
import { AddDamageReportForm, EditDamageReportForm } from "../../../components/DamageReportForm";
export default function RVDamagesInfo(){
    const [formType, setFormType] = useState(null)
    const {RV} = useRV();
    return(
        <>
        <div style={{height:"100%"}}>
            <DamageReportTable URL={`http://localhost:1231/damageReport/RV/${RV.VIN}`} forMe={false}/>
        </div>
        <div className="tableFooter">
            <button onClick={()=>setFormType("add")}>Add Damages</button>
            <button onClick={()=>setFormType("edit")}>Edit Damages</button>
        </div>
        {formType === "add" ?
            <AddDamageReportForm onExit={()=>setFormType(null)}/>
        : formType === "edit" ? 
            <EditDamageReportForm onExit={()=>setFormType(null)}/>  
        : <></>  
        }
        </>
    )
}