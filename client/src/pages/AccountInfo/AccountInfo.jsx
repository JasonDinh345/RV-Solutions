import { useEffect, useState } from "react"
import MyAccount from "./MyAccount/MyAccount"
import "./AccountInfo.css"
import { useAuth } from "../../hooks/useAuth"

import { useNavigate, useParams } from "react-router-dom"
import MyRVs from "./MyRVs/MyRVs"
import BookingsTable from "./components/BookingsTable"
import DamageReportTable from "./components/DamageReportTable"
export default function AccountInfo(){
    const navigate = useNavigate();
    
    const { account, logout} = useAuth();
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
            {account &&
             <div className="accountInfoContent">
                {currentTab === "Account" ? (
                    <MyAccount/>
                ):currentTab === "Bookings" ? (
                    <BookingsTable URL={`http://localhost:1231/booking/account/${account.AccountID}`} />
                ):currentTab === "RVs" ? (
                    <MyRVs/>
                ):currentTab === "Damages" ? (
                   <DamageReportTable URL={`http://localhost:1231/damageReport/account/${account.AccountID}`}/>
                ):(<></>)}
            </div>

            }
        </div>
        </>
    )
}