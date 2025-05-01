import { useState } from "react";
import { getFullYearDiff, getTodayPST } from "../../../util/dataUtil";

export default function CreateAccountForm({handleFormChange}){
    const [formData, setFormData] = useState({})
    const [confirmPassword, setConfirmPass] = useState("")
    const [formError, setFormError] = useState("")
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(formData.password != confirmPassword){
            setFormError("Passwords must match!")
            return
        }
        if(getFullYearDiff(formData.dateOfBirth, getTodayPST()) < 18){
            setFormError("Minors are unable to sign up for our service!")
            return
        }


    }
    const handleChange = (e)=>{
        const {name, value}  = e.target
        setFormData((prev)=>({...prev, [name]: value}))
    }

    
    return(
        <>
        <form id="createAccountForm" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
                <input id="name" name="name" type="text" required onChange={handleChange}></input>

            <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required onChange={handleChange}></input>

            <label htmlFor="password">Password:</label>
                <input id="password"name="password" type="password" required onChange={handleChange}></input>

            <label htmlFor="confirmPassword">Confirm Password:</label>
                <input id="confirmPassword"name="confirmPassword" type="password" required onChange={(e)=>{setConfirmPass(e.target.value)}}></input>

            <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input id="dateOfBirth"name="dateOfBirth" type="date" required onChange={handleChange}></input>

            <label htmlFor="phoneNumber">Phone Number:</label>
            <input id="phoneNumber"name="phoneNumber" type="tel" pattern="\([0-9]{3}\)-[0-9]{3}-[0-9]{4}" required onChange={handleChange}></input>

            <p className="hint">Format like: (111)-111-1111</p>
            <label htmlFor="insuranceCompany">Insurance Company:</label>
                <input id="insuranceCompany"name="insuranceCompany" type="text" required onChange={handleChange}></input>   
                
            <input type="submit" value="Create Account"/>
            {formError && <p className="error">{formError}</p>}
            <p onClick={handleFormChange}>Existing User?</p>
        </form>
        </>
    )
}