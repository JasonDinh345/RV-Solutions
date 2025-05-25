import { useRV } from "../../../../../hooks/useRV"
import DamageReportTable from "../../../components/DamageReportTable"
export default function RVDamagesInfo(){
    const {RV} = useRV();
    return(
        <>
        <div style={{height:"100%"}}>
             <DamageReportTable URL={`http://localhost:1231/damageReport/RV/${RV.VIN}`}/>
        </div>
        <div className="tableFooter">
            <button>Add Damages</button>
            <button>Edit Damages</button>
        </div>
        </>
    )
}