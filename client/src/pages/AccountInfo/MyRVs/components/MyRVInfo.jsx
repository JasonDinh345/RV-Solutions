
import { useState } from "react"
import { useRV } from "../../../../hooks/useRV"
import MyRVDescription from "./MyRVDescription";
import BookingsTable from "../../components/BookingsTable";
import DamageReportTable from "../../components/DamageReportTable";
import RVDamagesInfo from "./RVDamages/RVDamagesInfo";

export default function MyRVInfo(){
    const [currentTab, setCurrentTab] = useState("Info")
    const {RV , setRV} = useRV();
    return(
        RV && (
        <div className="blackBG" style={{display: RV  ? "flex" : "none"}}>
            <div id="myRVInfo" className="defaultBorder-thick">
                <div className="accountInfoSideBar">
                    <h3 className={currentTab === "Info"  ? "selected" : undefined} onClick={()=>setCurrentTab("Info")}>Info</h3>
                    <h3 className={currentTab === "Booking"  ? "selected" : undefined} onClick={()=>setCurrentTab("Booking")}>Bookings</h3>
                    <h3 className={currentTab === "DamageReport"  ? "selected" : undefined} onClick={()=>setCurrentTab("DamageReport")}>Damage Reports</h3>
                    <h3 className="logout" onClick={()=>setRV(null)}>Exit</h3>
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