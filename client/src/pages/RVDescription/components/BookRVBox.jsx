import { useState } from "react";
import { getDatePST, getDayDiff, getTodayPST } from "../../../util/dataUtil";

import feesInfo from "../../../assets/feesInfo";

export default function BookRVBox({costPer}){
    const [bookingInfo, setBookingInfo] = useState({
        startDate: getDatePST(),
        endDate: getTodayPST(),
    })
    const fees = feesInfo;
    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("hji")
    }
    const handleChange = (e)=>{
        if(e.target.name === "startDate"){
            if(e.target.value > bookingInfo.endDate){
                return setBookingInfo({...bookingInfo, [e.target.name]: e.target.value, endDate: e.target.value})
            }
        }
        return setBookingInfo({...bookingInfo, [e.target.name]: e.target.value})
    }
    const totalDays = getDayDiff(bookingInfo.startDate, bookingInfo.endDate) + 1;
    const flatCost = totalDays * costPer;
    const taxCost = (fees.taxRate * flatCost);
    const totalCost = (taxCost + flatCost).toFixed(2);
    return(
        <>
        <form onSubmit={handleSubmit} id="bookRVBox">
            <div id="bookingContainer">
                <div className="bookingDate">
                    <p>Start Date</p>
                    <input name="startDate" value={bookingInfo.startDate} onChange={handleChange} min={getTodayPST()}type="date"></input>
                </div>
                <div className="bookingDate">
                    <p>End Date</p>
                    <input name="endDate" value={bookingInfo.endDate} onChange={handleChange} min={bookingInfo.startDate}type="date"></input>
                </div>
            </div>
            <div id="costContainer" >
                <h3>Total: ${totalCost}</h3>
                <ul>{totalDays} days x ${costPer} per night</ul>
                
                <ul>------------------------------------</ul>
                <ul>Subtotal: ${flatCost}</ul>
                <ul>Sales Tax: ${taxCost.toFixed(2)}</ul>
                
            </div>
            <input type="submit" value={"Book Now"} className="bookingSubmit"></input>
        </form>
        </>
    )
}