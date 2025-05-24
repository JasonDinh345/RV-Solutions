import { useAuth } from "../hooks/useAuth";
import "./css/NavBar.css"
import { useNavigate } from "react-router-dom"
export default function NavBar(){
    const navigate = useNavigate();
    const {account} = useAuth();

    return(
        <>
            <nav id="nav">
                <img src="/logo.png" height='80%' onClick={()=>{navigate("/")}}></img>
                <h1>RV Solutions</h1>
                
                <h2 onClick={()=>{navigate("/")}} >Rent</h2>
                <h2 onClick={()=>{navigate("/host")}}>Host</h2>
                {account ? (
                    <h2 onClick={()=>{navigate("/accountInfo")}}>{account.Name}</h2>
                ):(
                    <h2 onClick={()=>{navigate("/login")}}>Login</h2>
                )}
            </nav>
        </>
    )
}