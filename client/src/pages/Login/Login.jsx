import { useState } from "react";
import LoginForm from "./components/LoginForm";
import CreateAccountForm from "./components/CreateAccountForm";
import "./Login.css"
export default function Login(){
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const handleFormChange = ()=>{
        setIsCreatingAccount(!isCreatingAccount)
    }
    return(
        <>
        <div id="loginMain" className="flexCenter">
            {isCreatingAccount ? (
                <CreateAccountForm handleFormChange={handleFormChange}/>
            ):(
                <LoginForm handleFormChange={handleFormChange}/>
            )}
            
        </div>
        </>
    )
}