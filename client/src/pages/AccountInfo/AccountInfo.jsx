import { useState } from "react"
import MyAccount from "./MyAccount/MyAccount"
import "./AccountInfo.css"
import { useAuth } from "../../context/AuthContext"

import { useNavigate } from "react-router-dom"
export default function AccountInfo(){
    const navigate = useNavigate();
    const {logout} = useAuth();
    const [currentTab, setCurrentTab] = useState("Account")
    const handleTabChange = (tab)=>{
        setCurrentTab(tab)
    }
    const handleLogout = ()=>{
        logout();
        navigate("/")
    }
    return(
        <>
        <div id="accountInfo">
            <div id="accountInfoSideBar">
                <h3 onClick={()=>handleTabChange("Account")} className={currentTab === "Account"  ? "selected" : undefined}>My Account</h3>
                <h3 onClick={()=>handleTabChange("Bookings")} className={currentTab === "Bookings"  ? "selected" : undefined}>My Bookings</h3>
                <h3 onClick={()=>handleTabChange("RVs")} className={currentTab === "RVs"  ? "selected" : undefined}>My RVs</h3>
                <h3 onClick={()=>handleTabChange("Damages")} className={currentTab === "Damages"  ? "selected" : undefined}>My Damages</h3>
                <h3 className="logout" onClick={handleLogout}>Logout</h3>
            </div>
            <div className="accountInfoContent">
                {currentTab === "Account" ? (
                    <MyAccount/>
                ):(<></>)}
            </div>
        </div>
        </>
    )
}