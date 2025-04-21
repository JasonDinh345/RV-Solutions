import "./css/NavBar.css"
import { useNavigate } from "react-router-dom"
export default function NavBar(){
    const navigate = useNavigate();

    
    return(
        <>
            <nav id="nav">
                <img src="/logo.png" height='80%' onClick={()=>{navigate("/")}}></img>
                <h1>RV Solutions</h1>
                
                <h2 onClick={()=>{navigate("/")}} >Rent</h2>
                <h2>Host</h2>
                
            </nav>
        </>
    )
}