import { useAuth } from "../../../hooks/useAuth";
import { reformatDate } from "../../../util/dataUtil";


import "./MyAccount.css"
import UpdateAccount from "./componets/UpdateAccount";
export default function MyAccount(){
    const {account, authLoading} = useAuth();
    
    if(authLoading && !account){
        return <p>Loading...</p>
    }
    return(
        <>
        <div className="myAccount">
            <h3>Name: <span>{account.Name}</span></h3>
            <h3>Email: <span>{account.Email}</span></h3>
            <h3>Address: <span>{account.Address}</span></h3>
            <h3>Phone Number: <span>{account.PhoneNumber}</span></h3>
            <h3>Date of Birth: <span>{reformatDate(account.DateOfBirth)}</span></h3>
            <h3>Insurance Company: <span>{account.InsuranceCompany}</span></h3>
            <UpdateAccount/>
            
        </div>
        
        </>
    )
}