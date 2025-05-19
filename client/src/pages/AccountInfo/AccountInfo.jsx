import { useEffect, useState } from "react"
import MyAccount from "./MyAccount/MyAccount"
import "./AccountInfo.css"
import { useAuth } from "../../hooks/useAuth"

import { useNavigate, useParams } from "react-router-dom"
import MyBookings from "./MyBookings/MyBookings"
import MyRVs from "./MyRVs/MyRVs"
export default function AccountInfo(){
    const navigate = useNavigate();
    
    const {logout} = useAuth();
    const [currentTab, setCurrentTab] = useState("Account")
    
    const handleLogout = ()=>{
        logout();
        navigate("/")
    }
    const {tab} = useParams()
    useEffect(()=>{
        if(tab){
            setCurrentTab(tab)
        }
    },[tab])
    return(
        <>
        <div id="accountInfo">
            <div className="accountInfoSideBar">
                <h3 onClick={()=>navigate("/accountInfo/Account")} className={currentTab === "Account"  ? "selected" : undefined}>My Account</h3>
                <h3 onClick={()=>navigate("/accountInfo/Bookings")} className={currentTab === "Bookings"  ? "selected" : undefined}>My Bookings</h3>
                <h3 onClick={()=>navigate("/accountInfo/RVs")} className={currentTab === "RVs"  ? "selected" : undefined}>My RVs</h3>
                <h3 onClick={()=>navigate("/accountInfo/Damages")} className={currentTab === "Damages"  ? "selected" : undefined}>My Damages</h3>
                <h3 className="logout" onClick={handleLogout}>Logout</h3>
            </div>
            <div className="accountInfoContent">
                {currentTab === "Account" ? (
                    <MyAccount/>
                ):currentTab === "Bookings" ? (
                    <MyBookings/>
                ):currentTab === "RVs" ? (
                    <MyRVs/>
                ):(<></>)}
            </div>
        </div>
        </>
    )
}