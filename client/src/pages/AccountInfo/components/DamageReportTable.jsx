import { useEffect, useState } from "react"
import useGet from "../../../hooks/useGet"
export default function DamageReportTable({URL}){
      const {data: reportList, isLoading, error} = useGet(URL)
    if(error && error.status === 404){
        return <h2 className="error header">No reports found!</h2>
    }
    if(error){
        console.log(error)
        return <h2 className="error header">Error getting reports!</h2>
    }
    return(
        <>
        {reportList && isLoading &&
            <table className="accountTable">
                <thead>
                    <tr>
                        <th>RV</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Damages</th>
                        <th>Deductions</th>
                        <th>Description</th>
                        <th>Is Paid?</th>
                        <th>Police Report ID</th>
                        <th>Incident Number</th>
                    </tr>
                </thead>
                <tbody>
                    {reportList.map((report,i)=>
                        <DamageReport reportID={report.ReportID} key={i+1}/>
                    )}
                </tbody>
            </table>
        }
        </>
    )
}
function DamageReport({reportID}){
    const [statusColor, setStatusColor] = useState("green")
    const {data: damageReport, isLoading} = useGet(`http://localhost:1231/damageReport/${reportID}`)
    useEffect(()=>{
        if(!damageReport || !damageReport.IsPaid){
            return
        }
        if(damageReport.IsPaid === 1){
            setStatusColor("green")
        }else{
            setStatusColor("red")
        }
    },[damageReport])
    return(
        <>
        {damageReport && !isLoading &&
        
            <tr>
                <td className="tableImage"><img src={damageReport.ImageURL}></img></td>
                <td>{damageReport.Damages}</td>
                <td>${damageReport.Deductions}</td>
                <td>{damageReport.Description}</td>
                <td style={{color: statusColor}}>{damageReport.IsPaid === 1 ? "Yes": "No"}</td>
                <td>{damageReport.PoliceReportID || "N/A"}</td>
                <td>{damageReport.IncidentNumber || "N/A"}</td>
            </tr>
        
        }
        </>
    )
}