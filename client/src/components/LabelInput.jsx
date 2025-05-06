import { useEffect, useState } from "react"
import "./css/LabelInput.css"
export function LabelInput({type, onChange, label,value}){
    const fieldName = label.replace(/\s/g,'')
    return(
        <>
        <div className="labelInputContainer">
            <label htmlFor={fieldName}><h3>{label}:</h3></label>
            <input className="labelInput" 
                    id={fieldName} 
                    name={fieldName} 
                    type={type} 
                    onChange={onChange} 
                    value={value ?? ""}
                    required>
            </input>
        </div>
        </>
    )
}

export function LabelSelect({fieldName, onChange, label, children}){
    return(
        <>
        <div className="labelInputContainer">
            <label htmlFor={fieldName}><h3>{label}</h3></label>
            <select className="labelSelect" id={fieldName} name={fieldName} onChange={onChange} required>
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
    },[confirmPass])
    return(
        <>
        <LabelInput type="password" onChange={onChange} label={label} value={value}/>
        <div className="labelInputContainer">
            <label htmlFor="confirmPass">Confirm Password:</label>
            <input className="labelInput" 
                type="password" 
                id="confirmPass" 
                onChange={(e)=>{setConfirmPass(e.target.value)}}>
            </input>
        </div>
      
        </>
    )
}