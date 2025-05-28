import { useEffect, useState } from "react"
import "./css/LabelInput.css"
export function LabelInput({type, onChange, label,value, fieldName, pattern }){
    
    const updatedFieldName = fieldName || label.replace(/\s+/g, "");
    return(
        <>
        <div className="labelInputContainer">
            <label htmlFor={updatedFieldName}><h3>{label}:</h3></label>
            <input className="labelInput" 
                    id={updatedFieldName} 
                    name={updatedFieldName} 
                    type={type} 
                    onChange={onChange} 
                    defaultValue={value ?? ""}
                     {...(pattern ? { pattern } : {})}
                    required>
            </input>
        </div>
        </>
    )
}

export function LabelSelect({fieldName, onChange, label, children, value}){
    const updatedFieldName = fieldName || label.replace(/\s+/g, "");
    return(
        <>
        <div className="labelInputContainer">
            <label htmlFor={updatedFieldName}><h3>{label}:</h3></label>
            <select className="labelSelect" id={updatedFieldName} name={updatedFieldName} onChange={onChange} defaultValue={value ?? ""} required>
                {children}
            </select>
        </div>
        </>
    )
}
export function InputPass({ onChange, label,value, setValid}){
    const [confirmPass, setConfirmPass] = useState("")
  
    useEffect(()=>{
        if(confirmPass != value && confirmPass.length != 0){
            setValid((prev)=>({...prev, password:false}))
           
        }else{
            setValid((prev)=>({...prev, password:true}))
    
        }
    },[confirmPass, setValid, value])
    return(
        <>
        <LabelInput type="password" onChange={onChange} label={label} value={value}/>
        <div className="labelInputContainer">
            <label htmlFor="confirmPass"><h3>Confirm Password:</h3></label>
            <input className="labelInput" 
                type="password" 
                id="confirmPass" 
                onChange={(e)=>{setConfirmPass(e.target.value)}}>
            </input>
        </div>
      
        </>
    )
}