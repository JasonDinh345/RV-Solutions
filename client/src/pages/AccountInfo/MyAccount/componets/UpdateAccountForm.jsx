import axios from "axios";
import { useEffect, useState } from "react"
import { useAuth } from "../../../../context/AuthContext";
import { InputPass, LabelInput } from "../../../../components/LabelInput";
export default function UpdateAccountForm({children}){
    const {account, authLoading} = useAuth();
    const [updateForm, setUpdateForm] = useState({})
    const [isValid, setValid] = useState(null)
    const [updateStatus, setUpdateStatus] = useState("")
    const [error, setError] = useState("");
    
    useEffect(()=>{
        setUpdateForm({...account, Password: ""})
    },[account])
    const handleSubmit = async(e)=>{
        setError()
        setUpdateStatus()
        e.preventDefault();
        if(!isValid?.password){
            setError("Passwords must match!")
        }
        try{
            const res = await axios.patch("http://localhost:1231/account/protected", updateForm,  {
                withCredentials : true
            })
            if(res.status === 204){
                setUpdateStatus("Updated Successfully")
            }
        }catch(err){
            console.error(err)
            setError(error.response.data.message)
        }
        

    }
    const handleChange = (e)=>{
        const {name, value} = e.target
        setUpdateForm({...updateForm, [name]:value})
    }
    
    return(
        <>
        <div className="blackBG">

            {account && !authLoading && (
                <form className="updateForm defaultBorder-thick" onSubmit={handleSubmit}> 
                    {children}
                    <LabelInput type="text" label="Name" onChange={handleChange} value={updateForm.Name}/>
                    <LabelInput type="email" label="Email" onChange={handleChange} value={updateForm.Email}/>
                    <LabelInput type="text" label="Address" onChange={handleChange} value={updateForm.Address}/>
                    <InputPass value={updateForm.Password} onChange={handleChange} label="Password" setValid={setValid}/>
                    <LabelInput type="tel" label="Phone Number" onChange={handleChange} value={updateForm.PhoneNumber}/>
                    <LabelInput type="text" label="Insurance Company" onChange={handleChange} value={updateForm.InsuranceCompany}/>
                    {error ? 
                        <p className="error">{error}</p>
                        : updateStatus ? 
                        <p className="success">{updateStatus}</p>
                        : <></>
                    }
                    <input type="submit" className="defaultBorder-thin"value="Update Form"></input>       
                </form>
            )}
        </div>
        </>
    )
}