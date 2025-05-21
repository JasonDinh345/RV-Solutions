import { useEffect, useState } from "react"
import useGet from "../../../hooks/useGet"
import {reformatDate} from "../../../util/dataUtil"
import { useNavigate } from "react-router-dom"

export default function Booking({bookingData}){
    const navigate =  useNavigate()
    const {data: RV, isLoading} = useGet(`http://localhost:1231/RV/${bookingData.VIN}`)
    const [statusColor, setStatusColor] = useState("black")
    useEffect(()=>{
        switch(bookingData.Status){
            case "Pending":
                setStatusColor("orange")
                break;
            case "Confirmed":
                setStatusColor("blue")
                break;
            case "Cancelled":
                setStatusColor("red")
                break;
            case "Completed":
                setStatusColor("lightgreen")
                break;
            default:
                setStatusColor("black")
                break;
        }
    },[bookingData.Status])
    return (
        <>
        {RV && !isLoading &&
            <>
            
            <tr>
                <td className="tableImage"><img src={RV.ImageURL} onClick={()=>navigate(`/RV/${RV.VIN}`)}></img></td>
                <td>{RV.Make}</td>
                <td>{RV.Model}</td>
                <td style={{color: statusColor}}>{bookingData.Status}</td>
                <td>{reformatDate(bookingData.StartDate)}</td>
                <td>{reformatDate(bookingData.EndDate)}</td>
                <td>{bookingData.TotalCost}</td>
            </tr>
            </>
        }
        </>
    )
}
