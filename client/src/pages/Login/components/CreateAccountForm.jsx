import { useState } from "react";
import { getFullYearDiff, getTodayPST } from "../../../util/dataUtil";
import {InputPass, LabelInput} from "../../../components/LabelInput"
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
export default function CreateAccountForm({handleFormChange}){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({})
    const {login} = useAuth();
    const [formError, setFormError] = useState("")
    const [isValid, setValid] = useState(false);
    const handleSubmit = async(e)=>{
        e.preventDefault();
         if(!isValid?.password){
            setFormError("Passwords must match!")
        }
        if(getFullYearDiff(formData.dateOfBirth, getTodayPST()) < 18){
            setFormError("Minors are unable to sign up for our service!")
            return
        }
        try{
            const res = await axios.post("http://localhost:1231/account/", formData)
            if(res.status === 201){
                const loginRes = await axios.post("http://localhost:1231/auth/login", {Email: formData.Email, Password: formData.Password}, {
                withCredentials: true 
                });
                if(loginRes.status === 201){
                    login(loginRes.data.account)
                    navigate("/")
                }
            }
        }catch(err){
            console.error(err)
            setFormError(err.response.data.message)
        }

    }
    const handleChange = (e)=>{
        const {name, value}  = e.target
        setFormData((prev)=>({...prev, [name]: value}))
    }

    
    return(
        <>
        <form id="createAccountForm" onSubmit={handleSubmit}>
            <LabelInput fieldName="Name" label="Name" value={formData.Name} onChange={handleChange}/>
            <LabelInput type="email" onChange={handleChange} label="Email" value={formData.Email} />

    
            <InputPass onChange={handleChange} value={formData.Password} label="Password" setValid={setValid}/>
            <LabelInput type="text" label="Address" onChange={handleChange}/>
            <LabelInput type="date" onChange={handleChange} label="Date of Birth" value={formData.DateOfBirth}/>
            <LabelInput type="tel" onChange={handleChange} label="Phone Number" value={formData.PhoneNumber} pattern="\([0-9]{3}\)-[0-9]{3}-[0-9]{4}"/>
            

            <p className="hint">Format like: (111)-111-1111</p>
            <label htmlFor="InsuranceCompany">Insurance Company:</label>
                <input id="InsuranceCompany"name="InsuranceCompany" type="text" required onChange={handleChange}></input>   
                
            <input type="submit" value="Create Account"/>
            {formError && <p className="error">{formError}</p>}
            <p onClick={handleFormChange}>Existing User?</p>
        </form>
        </>
    )
}