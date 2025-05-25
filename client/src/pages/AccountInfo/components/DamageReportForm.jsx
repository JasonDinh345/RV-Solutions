import { useEffect, useState } from "react"
import { useRV } from "../../../hooks/useRV";
import useGet from "../../../hooks/useGet";
import { LabelInput, LabelSelect } from "../../../components/LabelInput";
import { reformatDate } from "../../../util/dataUtil";
import axios from "axios";
import useAxiosSubmit from "../../../hooks/useAxiosSubmit";
import { removeKeys } from "../../../util/removeKeys";
export function AddDamageReportForm({onExit}){
    const [formData, setFormData] = useState({})
    const {sendRequest, loading, response, error} = useAxiosSubmit()
    const {RV} = useRV();
    const {data: bookings, isLoading} = useGet(`http://localhost:1231/booking/RV/${RV.VIN}`)
    const handleChange = (e)=>{
        const {name, value , checked} = e.target
        if(checked){
            setFormData((prev)=>({...prev, [name]: checked }))
        }else{
            setFormData((prev)=>({...prev, [name]: value }))
        }
    }
 
    const handleSubmit = async(e) =>  {
        e.preventDefault();
        setFormData({...formData, Deduction: +formData.Deduction})
        try{
            const result = await sendRequest({
                method: "post",
                url: `http://localhost:1231/damageReport`,
                data: formData
            })
            if(result){
                window.location.reload();
            }
        }catch(err){
            console.log(err)
        }
    }
    return(
        bookings && !isLoading && (
            <div className="blackBG">
                <form onSubmit={handleSubmit}>
                    <h3 className="exitButton" onClick={onExit}>X</h3>
                    <h1>Add Damage Report for:</h1>
                    <h2>{RV.Make}, {RV.Model}</h2>
                    <LabelSelect fieldName="BookingID" value={formData.BookingID} label="Choose a Booking" onChange={handleChange}>
                        <option value={-1}>Select A Report</option>
                        {bookings.map(booking =>
                            <option key={booking.BookingID} value={booking.BookingID}>{booking.Name}, {reformatDate(booking.StartDate)} - {reformatDate(booking.EndDate)}</option>
                        )}
                    </LabelSelect>
                    <LabelInput fieldName="Damages" value={formData.Damages} label="Describe the damages" onChange={handleChange}/>
                    
                    <label htmlFor="Description"><h3>Describe how the damages occured:</h3></label>
                    <textarea id="Description" 
                        name="Description" 
                        type="text" 
                        onChange={handleChange}  
                        rows={4} 
                        style={{ width: '100%', resize: 'vertical' }}
                        required  
                        value={formData.Description}>
                    </textarea>
               
                    
                    <LabelInput fieldName="Deduction" value={formData.Deduction} label="Cost of deductions" type="number" onChange={handleChange}/>
                    <LabelInput fieldName="PoliceReportID" value={formData.PoliceReportID} label="Police Report ID" onChange={handleChange}/>
                    <LabelInput fieldName="IncidentNumber" value={formData.IncidentNumber} label="Incident Number" onChange={handleChange}/>
                    <input type="submit" value="Add Damage Report" disabled={!formData.BookingID || formData.BookingID < 0}></input>
                    {loading ? <p className="success">Adding report...</p>: error ? <p className="error">{error.message}</p>: response ? <p className="success">Successfully added report!</p>:<></>}
                </form>
            </div>
        )
    )
}
export function EditDamageReportForm({onExit}){
    const [formData, setFormData] = useState({})
    const {RV} = useRV();
    const {data: reportList} = useGet(`http://localhost:1231/damageReport/RV/${RV.VIN}`)
    const {sendRequest, loading, response, error} = useAxiosSubmit()
    useEffect(()=>{
        async function getData(){
            if(formData.ReportID && formData.ReportID >= 0){
            const result = await axios.get(`http://localhost:1231/damageReport/${formData.ReportID}`)
            
            if(result.status === 200){
                setFormData(removeKeys(result.data, ['Make',"Model","VIN",'ImageURL',"Name"]))
            }
            }
        }
        getData()
    },[formData.ReportID])
    const handleDelete = async()=>{
        try{
            const result = await sendRequest({
                method: "delete",
                url: `http://localhost:1231/damageReport/${formData.ReportID}`,
            })
            
            if(result.status  === 204){
                window.location.reload();
            }
        }catch(err){
            console.log(err)
        }
    }
    const handleSubmit = async(e) =>  {
        e.preventDefault();
        
        const updatedData = { ...formData, Deduction: +formData.Deduction };
        try{
            const result = await sendRequest({
                method: "patch",
                url: `http://localhost:1231/damageReport/${formData.ReportID}`,
                data: updatedData
            })
            
            if(result.status  === 204){
                window.location.reload();
            }
        }catch(err){
            console.log(err)
        }
    }
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev, [name]: type === "checkbox" ? checked : value,
        }));
    };
    console.log(formData)
    return(
        
            reportList && (
                <div className="blackBG">
                <form onSubmit={handleSubmit}>
                    <h3 className="exitButton" onClick={onExit}>X</h3>
                    <h2>{RV.Make}, {RV.Model}</h2>
                     <LabelSelect fieldName="ReportID" value={formData.ReportID} label="Choose a Booking" onChange={handleChange}>
                        <option value={-1}>Select A Report</option>
                        {reportList.map(report =>
                            <option key={report.ReportID} value={report.ReportID}>Report ID: {report.ReportID}, {report.Name}</option>
                        )}
                    </LabelSelect>
                    <LabelInput fieldName="Damages" value={formData.Damages} label="Describe the damages" onChange={handleChange}/>
                    
                    <label htmlFor="Description"><h3>Describe how the damages occured:</h3></label>
                    <textarea id="Description" 
                        name="Description" 
                        type="text" 
                        onChange={handleChange}  
                        rows={4} 
                        style={{ width: '100%', resize: 'vertical' }}
                        required  
                        value={formData.Description}>
                    </textarea>
               
                    
                    <LabelInput fieldName="Deduction" value={formData.Deduction} label="Cost of deductions" type="number" onChange={handleChange}/>
                    <LabelInput fieldName="PoliceReportID" value={formData.PoliceReportID} label="Police Report ID" onChange={handleChange}/>
                    <LabelInput fieldName="IncidentNumber" value={formData.IncidentNumber} label="Incident Number" onChange={handleChange}/>
                    <label htmlFor="IsPaid" style={{fontWeight:"bolder", fontSize:"2vh"}}>Is Paid?:
                        <input id="IsPaid" type="checkbox" name="IsPaid" checked={Boolean(formData.IsPaid)} onChange={handleChange}></input>
                    </label>
                    <div>
                        <input type="submit" value="Update Damage Report" disabled={!formData.ReportID || formData.ReportID < 0}></input>
                        <button onClick={handleDelete} disabled={!formData.ReportID || formData.ReportID < 0}>Delete Report</button>
                    </div>
                     {loading ? <p className="success">Updating report...</p>: error ? <p className="error">{error.message}</p>: response ? <p className="success">Successfully updated report!</p>:<></>}
                </form>
                    
                
            </div>
            )
        
    )
}
