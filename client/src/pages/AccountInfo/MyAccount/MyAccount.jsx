import { useAuth } from "../../../context/AuthContext"
import { reformatDate } from "../../../util/dataUtil";
import MyInfo from "./componets/MyInfo";
import "./MyAccount.css"
export default function MyAccount(){
    const {account, authLoading} = useAuth();
    if(authLoading &&  !account){
        return <p>Loading...</p>
    }
    return(
        <>
        <div className="myAccount">
            <MyInfo label={"Name"} value={account.Name}></MyInfo>
            <MyInfo label={"Email"} value={account.Email}></MyInfo>
            <MyInfo label={"Address"} value={account.Address}></MyInfo>
            <MyInfo label={"Date Of Birth"} value={reformatDate(account.DateOfBirth)}></MyInfo>
            <MyInfo label={"Phone Number"} value={account.PhoneNumber}></MyInfo>
            <MyInfo label={"Insurance Company"} value={account.InsuranceCompany}></MyInfo>
            
        </div>
        </>
    )
}