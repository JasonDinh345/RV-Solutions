import "./css/LabelInput.css"
export function LabelInput({type, fieldName, onChange, label}){
    return(
        <>
        <div className="labelInputContainer">
            <label htmlFor={fieldName}><h3>{label}</h3></label>
            <input className="labelInput" id={fieldName} name={fieldName} type={type} onChange={onChange} required></input>
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