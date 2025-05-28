import axios from "axios"
import { useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { LabelInput } from "../../../components/LabelInput"

export default function LoginForm({handleFormChange}){
    const [formData, setFormData] = useState({})
    const {login} = useAuth();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleSubmit =async(e)=>{
        e.preventDefault()
        setError(null)
        try{
            const res = await axios.post("http://localhost:1231/auth/login", formData, {
                withCredentials: true 
              });
            if(res.status === 201){
                
                login(res.data.account)
                navigate("/")
            }else{
                setError("Incorrect email or password!")
            }
        }catch(err){
            console.error(err)
            setError("Incorrect email or password!")
        }
    }
    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData((prev)=>({...prev, [name]: value}))
    }  

    return(
        <>
        <form id="loginForm" onSubmit={handleSubmit}>
            <LabelInput type="email" onChange={handleChange} label="Email" value={formData.Email} fieldName="Email"/>
            <LabelInput type="password" onChange={handleChange} label="Password" value={formData.Password} fieldName="Password"/>
            
            <input type="submit" value="Login"/>
            {error && <p className="error">{error}</p>}
            <p onClick={handleFormChange}>New User?</p>
        </form>
        </>
    )
}