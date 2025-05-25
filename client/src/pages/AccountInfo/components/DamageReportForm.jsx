import axios from "axios"
import { useEffect, useState } from "react"

export function AddDamageReportForm({re}){
    const [formData, setFormData] = useState(reportData || {})
    const [reportID, setReportID] = useState(reportData?.reportdID || null)
    const {RV} = useRV()
   
    return(
        <div className="blackBG">
            <form>
                <h2>{RV.Make}, {RV.Model}</h2>
            </form>
        </div>
    )
}
