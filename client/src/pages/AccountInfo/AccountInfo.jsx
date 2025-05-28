import { useEffect, useState } from "react"
import MyAccount from "./MyAccount/MyAccount"
import "./AccountInfo.css"
import { useAuth } from "../../hooks/useAuth"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import MyRVs from "./MyRVs/MyRVs"

import DamageReportTable from "./components/DamageReportTable"
export default function AccountInfo(){
    const navigate = useNavigate();
    const [html, setHtml] = useState('');
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
    useEffect(() => {
        if(account){
            axios.get(`http://localhost:1231/booking/account/HTML/${account.AccountID}`, { responseType: 'text' }) // important: response as text
            .then(response => {
                setHtml(response.data);
            })
            .catch(error => {
                console.error('Error loading snippet:', error);
            });
                }
            }
    , [account]);
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
                     <div dangerouslySetInnerHTML={{ __html: html }} />
                ):currentTab === "RVs" ? (
                    <MyRVs/>
                ):currentTab === "Damages" ? (
                   <DamageReportTable URL={`http://localhost:1231/damageReport/account/${account.AccountID}`} forMe={true}/>
                ):(<></>)}
            </div>

            }
        </div>
        </>
    )
}