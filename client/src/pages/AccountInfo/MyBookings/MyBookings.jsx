
import useGet from "../../../hooks/useGet";
import { useAuth } from "../../../hooks/useAuth";
import Booking from "./components/Booking";

export default function MyBookings(){
    const {account, authLoading, error: authError} = useAuth();
    const {data: bookings, isLoading, error} = useGet(account?.AccountID ? `http://localhost:1231/booking/account/${account.AccountID}` : null)
    
    if(isLoading || authLoading){
        return <p className="flexCenter">Loading...</p>
    }
    if(error){
        if(error?.response.status === 404){
            return <h1 className="flexCenter" style={{marginTop: "2%"}}>No bookings found!</h1>
        }else{
            return <p>{error}</p>
        }
    }else if (authError){
        return <p>{authError}</p>
    }
    return(
        <>
        {account && bookings && 
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
                <Booking key={i+1} bookingData={booking}/>
            )}
            </tbody>
        </table>
        }
        </>
    )
}