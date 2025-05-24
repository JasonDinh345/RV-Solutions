import axios from "axios"
import { useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function LoginForm({handleFormChange}){
    const [formData, setFormData] = useState({})
    const {login} = useAuth();
    const navigate = useNavigate();
    const handleSubmit =async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post("http://localhost:1231/auth/login", formData, {
                withCredentials: true 
              });
            if(res.status === 201){
                
                login(res.data.account)
                navigate("/")
            }else{
                console.log("nay")
            }
        }catch(err){
            console.error(err)
        }
    }
    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData((prev)=>({...prev, [name]: value}))
    }  
    return(
        <>
        <form id="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="Email">Email:</label>
            <input id="Email" name="Email" type="email" required onChange={handleChange}></input>
            <label htmlFor="Password" required>Password:</label>
            <input id="Password"name="Password" type="password" required onChange={handleChange}></input>
            <input type="submit" value="Login"/>
            <p onClick={handleFormChange}>New User?</p>
        </form>
        </>
    )
}