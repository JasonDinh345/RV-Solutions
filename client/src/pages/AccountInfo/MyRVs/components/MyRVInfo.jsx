
import { useState, useEffect } from "react"
import { useRV } from "../../../../hooks/useRV"
import MyRVDescription from "./MyRVDescription";
import BookingsTable from "../../components/BookingsTable";
import RVDamagesInfo from "./RVDamages/RVDamagesInfo";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function MyRVInfo(){
    const [currentTab, setCurrentTab] = useState("Info")
    const {RV , handleSetRV} = useRV();
    const navigate = useNavigate();
    
    const { subTab, vin } = useParams();
    useEffect(()=>{
        if(subTab){
            setCurrentTab(subTab)
        }
        if(vin){
            handleSetRV(vin)
        }
    },[subTab,vin, handleSetRV])
    
    return(
        RV && (
        <div className="blackBG" style={{display: RV  ? "flex" : "none"}}>
            <div id="myRVInfo" className="defaultBorder-thick">
                <div className="accountInfoSideBar">
                    <h3 className={currentTab === "Info"  ? "selected" : undefined} onClick={()=>navigate(`/accountInfo/RVs/${RV.VIN}/Info`)}>Info</h3>
                    <h3 className={currentTab === "Booking"  ? "selected" : undefined} onClick={()=>navigate(`/accountInfo/RVs/${RV.VIN}/Booking`)}>Bookings</h3>
                    <h3 className={currentTab === "DamageReport"  ? "selected" : undefined} onClick={()=>navigate(`/accountInfo/RVs/${RV.VIN}/DamageReport`)}>Damage Reports</h3>
                    <h3 className="logout" onClick={()=>handleSetRV(null)}>Exit</h3>
                </div>
                <div id="rvInfoMain">
                    {currentTab === "Info" ? (
                        <MyRVDescription/>
                    ): currentTab === "Booking" ?(
                        <BookingsTable URL={`http://localhost:1231/booking/RV/${RV.VIN}`}/>
                    ):currentTab === "DamageReport" ?(
                        <RVDamagesInfo/>
                    ):(<></>)}
                </div>
            </div>
        </div>
        )
        
    )
}