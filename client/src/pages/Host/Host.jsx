import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import {LabelInput, LabelSelect} from "../../components/LabelInput";
import "./Host.css"
import axios from "axios";
export default function Host(){
    const [formData, setFormData] = useState({
        isAvailable: false,
        SizeClass: "A"

    })
    const [rvImage, setRVImage] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate();
    const {account, authLoading} = useAuth();
    const [uploadStatus, setUploadStatus] = useState()
    const handleImageChange = (e)=>{
        setRVImage(e.target.files[0])
    }
    useEffect(()=>{
        if(!account && !authLoading){
            navigate("/login")
        }else if(account){
            setFormData((prev)=>({...prev, ownerID: account.AccountID }))
        }
    },[account,authLoading,navigate])
    const handleChange = (e)=>{
        const {name, value , checked} = e.target
        if(checked){
            setFormData((prev)=>({...prev, [name]: checked }))
        }else{
            setFormData((prev)=>({...prev, [name]: value }))
        }
        
    }
   
    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError(null)
        setUploadStatus("Uploading RV...")
        setFormData((prev)=>({...prev, Mileage: +formData.Mileage, CostToRent: +formData.CostToRent }))
        try{
            const res = await axios.post("http://localhost:1231/RV", formData)
           
            if(res.status === 201){
                setUploadStatus("Uploading image...")
                const imageForm = new FormData();
                imageForm.append("img", rvImage)
                imageForm.append("VIN", formData.VIN)
                const imgRes = await axios.post("http://localhost:1231/image", imageForm, {
                    headers: {
                      "Content-Type": "multipart/form-data",  
                    }
                })
                
                if(imgRes.status === 201){
                    //redirect when implemented
                    setUploadStatus("Upload Complete")
                }
            }
        }catch(err){
            console.error(err)
            setError(err.message)
        }
        
    }
    console.log(formData)
    return(
        <>
        <form id="hostRVForm" onSubmit={handleSubmit}>
            <label><h3>RV Image:</h3></label>
            <input type="file" accept="image/*" onChange={handleImageChange} required></input>
            {rvImage && <img src={URL.createObjectURL(rvImage)} alt="Image preview" style={{  width:"30vw" }} />}
            
            <LabelInput type="text" fieldName={"Make"} onChange={handleChange} label="Make"></LabelInput>
                
            <LabelInput type="text" fieldName={"Model"} onChange={handleChange} label="Model"></LabelInput>
                
            <LabelSelect fieldName={"SizeClass"} label="RV Class:" onChange={handleChange}>
                <option>A</option>
                <option>B</option>
                <option>C</option>
            </LabelSelect>
                
            <LabelInput type="text" fieldName={"VIN"} onChange={handleChange} label="VIN"></LabelInput>
            
            <LabelInput type="text" fieldName={"Location"} onChange={handleChange} label="Location"></LabelInput>
            <LabelInput type="number" fieldName={"CostToRent"} onChange={handleChange} label="Cost To Rent"></LabelInput>
            <label htmlFor="Description"><h3>Description:</h3></label>
            <textarea id="Description" name="Description"type="text" onChange={handleChange}  rows={4}  style={{ width: '100%', resize: 'vertical' }}required></textarea>
            <LabelInput type="number" fieldName={"Mileage"} onChange={handleChange} label="Mileage"></LabelInput>
            <label htmlFor="isAvailable" style={{fontWeight:"bolder", fontSize:"2vh"}}>Set Immediately Available:
                <input id="isAvailable" type="checkbox" name="isAvailable"defaultValue={true} onChange={handleChange}></input>
            </label>
            <input type="submit" value="Host RV"></input>

            {error  ?(
                <p className="error">{error}</p>
            ): uploadStatus ? (
                <p className="success">{uploadStatus}</p>
            ):(<></>)}
        </form>
        </>
    )
}