
import useGet from "../../../hooks/useGet"
export default function DamageReportTable({URL, onClick}){
    const {data: reportList, isLoading, error} = useGet(URL)
    console.log(reportList)
    if(error && error.status === 404){
        return <h2 className="error header">No reports found!</h2>
    }
    if(error){
        console.log(error)
        return <h2 className="error header">Error getting reports!</h2>
    }
    return(
        <>
        {reportList && !isLoading &&
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
                        <DamageReport reportID={report.ReportID} onClick={onClick}key={i+1}/>
                    )}
                </tbody>
            </table>
        }
        </>
    )
}
function DamageReport({reportID, onClick}){
    const {data: damageReport, isLoading} = useGet(`http://localhost:1231/damageReport/${reportID}`)
    console.log(damageReport)
    
    return(
        <>
        {damageReport && !isLoading &&
        
            <tr>
                <td className="tableImage"><img src={damageReport.ImageURL} onClick={onClick}></img></td>
                <td>{damageReport.Make}</td>
                <td>{damageReport.Model}</td>
                <td>{damageReport.Damages}</td>
                <td>${damageReport.Deduction}</td>
                <td>{damageReport.Description}</td>
                {damageReport.IsPaid === 1 ? 
                    <td style={{color: "green"}}>Yes</td>
                : 
                    <td style={{color: "red"}}>No</td>
                }
                <td>{damageReport.PoliceReportID || "N/A"}</td>
                <td>{damageReport.IncidentNumber || "N/A"}</td>
            </tr>
            
        
        }
        </>
    )
}