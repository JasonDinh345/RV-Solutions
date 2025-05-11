import { useMemo, useState } from "react";
import { getDatePST, getDayDiff, getTodayPST } from "../../../util/dataUtil";
import {useNavigate, useParams} from "react-router-dom"
import feesInfo from "../../../assets/feesInfo";
import {useAuth} from "../../../context/AuthContext"
import axios from "axios";
export default function BookRVBox({costPer}){
    const {vin} = useParams();
    const navigate = useNavigate();
    const [bookingInfo, setBookingInfo] = useState({
        StartDate: getDatePST(),
        EndDate: getTodayPST(),
    })
    const fees = feesInfo;
    const totalDays = useMemo(() => 
        getDayDiff(bookingInfo.StartDate, bookingInfo.EndDate) + 1, 
        [bookingInfo.StartDate, bookingInfo.EndDate]
      );
    const flatCost = useMemo(()=>{
        return (totalDays * costPer)
    }, [totalDays, costPer])
    const taxCost = useMemo(()=>{
        return (fees.taxRate * flatCost)
    },[fees.taxRate,flatCost])
       
    const totalCost = useMemo(()=>{
        return parseFloat((taxCost + flatCost).toFixed(2));
    },[taxCost, flatCost])
    const {account} = useAuth();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        
        try{
            
            const res = await axios.post("http://localhost:1231/booking", {...bookingInfo, VIN: vin, AccountID: account.AccountID, TotalCost: totalCost})
            if(res.status === 201){
                navigate("/accountInfo/bookings")
            }
        }catch(err){
            console.error(err)
            alert(err.response.data.message)
        }
    }
   
    const handleChange = (e)=>{
        if(e.target.name === "StartDate"){
            if(e.target.value > bookingInfo.EndDate){
                return setBookingInfo({...bookingInfo, [e.target.name]: e.target.value, EndDate: e.target.value})
            }
        }
        return setBookingInfo({...bookingInfo, [e.target.name]: e.target.value})
    }
    

    return(
        <>
        <form onSubmit={handleSubmit} id="bookRVBox">
            <div id="bookingContainer">
                <div className="bookingDate">
                    <p>Start Date</p>
                    <input name="StartDate" value={bookingInfo.StartDate} onChange={handleChange} min={getTodayPST()}type="date"></input>
                </div>
                <div className="bookingDate">
                    <p>End Date</p>
                    <input name="EndDate" value={bookingInfo.EndDate} onChange={handleChange} min={bookingInfo.StartDate}type="date"></input>
                </div>
            </div>
            <div id="costContainer" >
                <h3>Total: ${totalCost}</h3>
                <ul>{totalDays} days x ${costPer} per night</ul>
                
                <ul>------------------------------------</ul>
                <ul>Subtotal: ${flatCost}</ul>
                <ul>Sales Tax: ${taxCost.toFixed(2)}</ul>
                
            </div>
            <input type="submit" value={"Book Now"} className="bookingSubmit" disabled={account  ? false: true}></input>
        </form>
        </>
    )
}