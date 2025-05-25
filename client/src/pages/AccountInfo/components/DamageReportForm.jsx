import { useState } from "react"
import { useRV } from "../../../hooks/useRV";
import useGet from "../../../hooks/useGet";
import { LabelInput, LabelSelect } from "../../../components/LabelInput";

export function AddDamageReportForm(){
    const [formData, setFormData] = useState({})
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
    return(
        bookings && !isLoading && (
            <div className="blackBG">
                <form>
                    <h2>{RV.Make}, {RV.Model}</h2>
                    <LabelSelect fieldName="BookingID" value={formData.BookingID} label="Choose a Booking" onChange={handleChange}>
                        {bookings.map(booking =>
                            <option key={booking.BookingID} value={booking.BookingID}>{booking.BookingID}</option>
                        )}
                    </LabelSelect>
                    <LabelInput fieldName="Damages" value={formData.Damages} label="Describe the damages" onChange={handleChange}/>
                    <div className="labelInputContainer">
                        <label htmlFor="Description">Describe how the damages occured:</label>
                        <textarea id="Description" 
                            name="Description" 
                            type="text" 
                            onChange={handleChange}  
                            rows={4} 
                            style={{ width: '100%', resize: 'vertical' }}
                            required  
                            value={formData.Description}>
                        </textarea>
                    </div>
                    
                    <LabelInput fieldName="Deduction" value={formData.Deduction} label="Cost of deductions" type="number" onChange={handleChange}/>
                    <LabelInput fieldName="PoliceReportID" value={formData.PoliceReportID} label="Police Report ID" onChange={handleChange}/>
                    <LabelInput fieldName="IncidentNumber" value={formData.IncidentNumber} label="Incident Number" onChange={handleChange}/>
                </form>
            </div>
        )
    )
}
export function EditDamageReportForm({reportData}){
    const [formData, setFormData] = useState(reportData)
    const {RV} = useRV();
   
    const handleChange = (e)=>{
        const {name, value , checked} = e.target
        if(checked){
            setFormData((prev)=>({...prev, [name]: checked }))
        }else{
            setFormData((prev)=>({...prev, [name]: value }))
        }
    }
    return(
        
            <div className="blackBG">
                <form>
                    <h2>{RV.Make}, {RV.Model}</h2>
                    
                </form>
            </div>
        
    )
}
