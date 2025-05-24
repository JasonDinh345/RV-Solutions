import { useState } from "react"
import UpdateAccountForm from "./UpdateAccountForm"

export default function UpdateAccount(){
    const [isEditing, setIsEditing] = useState(false)
    return(
        <>
        <button className="defaultBorder-thin" onClick={()=>{setIsEditing(true)}}>Edit</button>
        {isEditing &&
            <UpdateAccountForm>
                <h3 className="exitButton" onClick={()=>{setIsEditing(false)}}>X</h3>
            </UpdateAccountForm>}
        </>
    )
}