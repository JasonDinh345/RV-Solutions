
import useGet from "../../../hooks/useGet"
export default function DamageReportTable({URL, forMe}){
    const {data: reportList, isLoading, error} = useGet(URL)
   
    if(error && error.status === 404){
        return <h2 className="error header">No reports found!</h2>
    }
    if(error){
        
        return <h2 className="error header">Error getting reports!</h2>
    }
    return(
        <>
        {reportList && !isLoading &&
            (
                forMe ? (
                    <table className="accountTable">
                        <DRTableHeaderForMe/>
                        <tbody>
                            {reportList.map((report,i)=>
                                <DamageReportForMe reportID={report.ReportID} key={i+1}/>
                            )}
                        </tbody>
                    </table>
                ):
                <table className="accountTable">
                    <DRTableHeader/>
                    <tbody>
                        {reportList.map((report,i)=>
                            <DamageReport reportID={report.ReportID} key={i+1}/>
                        )}
                    </tbody>
                </table>
            )
        }
        </>
    )
}
function DamageReportForMe({reportID}){
    const {data: damageReport, isLoading} = useGet(`http://localhost:1231/damageReport/${reportID}`)
    
    
    return(
        <>
        {damageReport && !isLoading &&
        
            <tr>
                <td className="tableImage"><img src={damageReport.ImageURL} ></img></td>
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
function DamageReport({reportID}){
    const {data: damageReport, isLoading} = useGet(`http://localhost:1231/damageReport/${reportID}`)
    
    
    return(
        <>
        {damageReport && !isLoading &&
        
            <tr>
                <td>{damageReport.ReportID}</td>
                <td>{damageReport.Name}</td>
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
function DRTableHeader(){
    return(
        <thead>
            <tr>
                <th>Report ID</th>
                <th>Rentor</th>
                <th>Damages</th>
                <th>Deductions</th>
                <th>Description</th>
                <th>Is Paid?</th>
                <th>Police Report ID</th>
                <th>Incident Number</th>
            </tr>
        </thead>
    )
}
function DRTableHeaderForMe(){
    return(
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
    )
}