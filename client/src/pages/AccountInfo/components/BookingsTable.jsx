import { useNavigate } from "react-router-dom"
import useGet from "../../../hooks/useGet"
import { useState, useEffect } from "react"
import {reformatDate} from "../../../util/dataUtil.js"
export default function BookingsTable({URL}){
    const {data: bookings, isLoading, error} = useGet(URL)
    if(error  && error.status === 404){
        return <h2  className="error header">No bookings found!</h2>
    }
    if(error){
        return <h2  className="error header">Error getting bookings!</h2>
    }
    return(
        <>
        {bookings && !isLoading &&
        <table className="accountTable">
            <thead>
            <tr>
                <th>RV</th>
                <th>Model</th>
                <th>Make</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Cost</th>
            </tr>
            </thead>
            <tbody>
            {bookings.map((booking, i)=>
                <Booking key={i+1} bookingID={booking.BookingID}/>
            )}
            </tbody>
        </table>
        }
        </>
    )
}
function Booking({bookingID}){
    const navigate =  useNavigate()
    
    const {data: bookingData, isLoading} = useGet(`http://localhost:1231/booking/${bookingID}`)
    const [statusColor, setStatusColor] = useState("black")
    useEffect(()=>{
        if (!bookingData || !bookingData.Status) return;
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
    },[bookingData])
    return (
        <>
        {bookingData && !isLoading &&
            <>
            
            <tr>
                <td className="tableImage"><img src={bookingData.ImageURL} onClick={()=>navigate(`/RV/${bookingData.VIN}`)}></img></td>
                <td>{bookingData.Make}</td>
                <td>{bookingData.Model}</td>
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