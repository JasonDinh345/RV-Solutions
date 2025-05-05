import axios from "axios";
import { useEffect, useState } from "react"

export default function UpdateAccountForm({field}){
    const [updatedField, setUpdatedField] = useState({})
    const [input, setInput] = useState()
    const [error, setError] = useState();
    const [updateStatus, setUpdateStatus] = useState();
    const handleChange=(e)=>{
        const {name, value} = e.target
        
        setUpdatedField({[name]:value})
    }
    useEffect(()=>{
        switch(field){
            case "Email":
                setInput(<input name="Email" type="email" required onChange={handleChange}></input>)
                break;
            case "Password":
                setInput(<input name="Password" type="password" required onChange={handleChange}></input>)
                break;
            case "Phone Number":
                setInput(<input name="PhoneNumber" type="tel" pattern="\([0-9]{3}\)-[0-9]{3}-[0-9]{4}" required onChange={handleChange}></input>)
                break;
            default:
                setInput(<input type="text" name={field.replace(/\s+/g, '')} onChange={handleChange} required></input>)
                break;
        }
    },[field])
    const handleSubmit =async(e)=>{
        e.preventDefault()
        setError()
        setUpdateStatus()
        try{
            const res = await axios.patch("http://localhost:1231/account/protected", updatedField, {withCredentials: true})
            if(res.status === 204){
                setUpdateStatus("Updated Successfully")
                window.location.reload();
            }
        }catch(err){
            console.error(err)
            setError((err.response?.data?.message || 'Unknown error occurred!') + " Please reload the page")
        }
        
    }
    return(
        <>
        <div className="blackBG">
            <form className="updateForm" onSubmit={handleSubmit}>
                <h3>{field}: </h3>
                {input}
                <input type="submit" value="Update"></input>
                {error ? (<p>{error}</p>): updateStatus ? (<p>{updateStatus}</p>):(<></>)}
            </form>
        </div>
        </>
    )
}