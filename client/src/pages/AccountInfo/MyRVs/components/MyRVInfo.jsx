import { useState } from "react"
import { useRV } from "../../../../hooks/useRV"
import MyRVDescription from "./MyRVDescription";

export default function MyRVInfo(){
    const [currentTab, setCurrentTab] = useState("Info")
    const {RV , setRV} = useRV();
    return(
        <div className="blackBG" style={{display: RV  ? "flex" : "none"}}>
            <div id="myRVInfo" className="defaultBorder-thick">
                <div className="accountInfoSideBar">
                    <h3 className={currentTab === "Info"  ? "selected" : undefined}>Info</h3>
                    <h3 className={currentTab === "Booking"  ? "selected" : undefined}>Bookings</h3>
                    <h3 className={currentTab === "DamageReport"  ? "selected" : undefined}>Damage Reports</h3>
                    <h3 className="logout" onClick={()=>setRV(null)}>Exit</h3>
                </div>
                <div id="rvInfoMain">
                    {currentTab === "Info" ? (
                        <MyRVDescription/>
                    ):(<></>)}
                </div>
            </div>
        </div>
    )
}