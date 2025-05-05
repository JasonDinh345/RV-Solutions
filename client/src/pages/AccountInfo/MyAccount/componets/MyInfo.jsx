import { useState } from "react"
import UpdateAccountForm from "./UpdateAccountForm"

export default function MyInfo({label, value}){
    const [isEditing, setIsEditing] = useState(false)
    const handleEdit = ()=>{
        setIsEditing(true)
    }
    return(
        <>
        <div className="myInfo">
            <h3>{label}: {value}</h3>
            {label !== "Date Of Birth" && <button className="defaultBorder-thin"onClick={handleEdit}>Edit</button>}
        </div>
        {isEditing && <UpdateAccountForm field={label}/>}
        </>
    )
}