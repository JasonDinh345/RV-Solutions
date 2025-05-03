import { useState } from "react";
import { getFullYearDiff, getTodayPST } from "../../../util/dataUtil";
import axios from "axios";

export default function CreateAccountForm({handleFormChange}){
    const [formData, setFormData] = useState({})
    const [confirmPassword, setConfirmPass] = useState("")
    const [formError, setFormError] = useState("")
    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(formData.password != confirmPassword){
            setFormError("Passwords must match!")
            return
        }
        if(getFullYearDiff(formData.dateOfBirth, getTodayPST()) < 18){
            setFormError("Minors are unable to sign up for our service!")
            return
        }
        try{
            const res = await axios.post("http://localhost:1231/account/", formData)
            if(res.status === 201){
                console.log("yaya")
            }else{
                console.log("nay")
            }
        }catch(err){
            console.error(err)
        }

    }
    const handleChange = (e)=>{
        const {name, value}  = e.target
        setFormData((prev)=>({...prev, [name]: value}))
    }

    
    return(
        <>
        <form id="createAccountForm" onSubmit={handleSubmit}>
            <label htmlFor="Name">Name:</label>
                <input id="Name" name="Name" type="text" required onChange={handleChange}></input>

            <label htmlFor="Email">Email:</label>
                <input id="Email" name="Email" type="email" required onChange={handleChange}></input>

            <label htmlFor="Password">Password:</label>
                <input id="Password"name="Password" type="password" required onChange={handleChange}></input>

            <label htmlFor="confirmPassword">Confirm Password:</label>
                <input id="confirmPassword"name="confirmPassword" type="password" required onChange={(e)=>{setConfirmPass(e.target.value)}}></input>

            <label htmlFor="DateOfBirth">Date of Birth:</label>
                <input id="DateOfBirth"name="DateOfBirth" type="date" required onChange={handleChange}></input>

            <label htmlFor="PhoneNumber">Phone Number:</label>
            <input id="PhoneNumber"name="PhoneNumber" type="tel" pattern="\([0-9]{3}\)-[0-9]{3}-[0-9]{4}" required onChange={handleChange}></input>

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