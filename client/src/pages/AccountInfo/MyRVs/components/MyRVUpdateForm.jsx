import { useRV } from "../../../../hooks/useRV"
import { useState } from "react"

import axios from "axios"
import { LabelInput, LabelSelect } from "../../../../components/LabelInput"
import { removeKeys } from "../../../../util/removeKeys"
export default function MyRVUpdateForm({onExit}){
    
    const [rvImage, setRVImage] = useState()
    const [error, setError] = useState()
    
    
    const [uploadStatus, setUploadStatus] = useState()
    const {RV} = useRV();
    const [formData, setFormData] = useState(removeKeys(RV, ['ImageID','ImageURL']))
    const handleImageChange = (e)=>{
        setRVImage(e.target.files[0])
    }
    
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
        setUploadStatus("Updating RV...")
        setFormData((prev)=>({...prev, Mileage: +formData.Mileage, CostToRent: +formData.CostToRent }))
        try{
            const requestBody = new FormData();
            if(rvImage){
                requestBody.append("img", rvImage)
            }
            requestBody.append("RV", JSON.stringify(formData))
            const res = await axios.patch(`http://localhost:1231/RV/${RV.VIN}/${RV.ImageID}`, requestBody,{
                    headers: {
                      "Content-Type": "multipart/form-data",  
                    }
                })
                
            if(res.status == 204){
                setUploadStatus("Updating Complete")
                window.location.reload();
            }
                
            
        }catch(err){
            console.error(err)
            setError(err.message)
        }
        
    }
    
    
    return(
           <div className="blackBG">
             <>
            <form id="updateMyRVForm" className="defaultBorder-thick" onSubmit={handleSubmit}>
                <h3 className="exitButton" onClick={onExit}>X</h3>
                <label><h3>RV Image:</h3></label>
                <input type="file" accept="image/*" onChange={handleImageChange} ></input>
                {rvImage ? <img src={URL.createObjectURL(rvImage)} alt="Image preview" style={{  width:"30vw" }} />  
                : RV.ImageURL ? 
                    <>
                    <img src={RV.ImageURL} alt="Image preview" style={{  width:"30vw" }} />
                    <h3>(Previous Image)</h3>
                    </>
                :<></>}
                
                <LabelInput type="text" fieldName={"Make"} onChange={handleChange} label="Make" value={formData.Make}></LabelInput>
                    
                <LabelInput type="text" fieldName={"Model"} onChange={handleChange} label="Model" value={formData.Model}></LabelInput>
                    
                <LabelSelect fieldName={"SizeClass"} label="RV Class:" onChange={handleChange} value={formData.SizeClass}>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                </LabelSelect>
                    
                <LabelInput type="text" fieldName={"VIN"} onChange={handleChange} label="VIN" value={formData.VIN}></LabelInput>
                
                <LabelInput type="text" fieldName={"City"} onChange={handleChange} label="City"  value={formData.City}></LabelInput>
                <LabelInput type="text" fieldName={"State"} onChange={handleChange} label="State"  value={formData.State}></LabelInput>
                <p className="hint">Example: WA</p>
                <LabelInput type="number" fieldName={"CostToRent"} onChange={handleChange} label="Cost To Rent" value={formData.CostToRent}></LabelInput>
                <label htmlFor="Description"><h3>Description:</h3></label>
                <textarea id="Description" name="Description"type="text" onChange={handleChange}  rows={4}  style={{ width: '100%', resize: 'vertical' }}required value={formData.Description}></textarea>
                <LabelInput type="number" fieldName={"Mileage"} onChange={handleChange} label="Mileage" value={formData.Mileage}></LabelInput>
                <label htmlFor="isAvailable" style={{fontWeight:"bolder", fontSize:"2vh"}}>Set Immediately Available:
                    <input id="isAvailable" type="checkbox" name="isAvailable" checked={Boolean(formData.isAvailable)} onChange={handleChange} ></input>
                </label>
                <input type="submit" value="Update RV"></input>
    
                {error  ?(
                    <p className="error">{error}</p>
                ): uploadStatus ? (
                    <p className="success">{uploadStatus}</p>
                ):(<></>)}
            </form>
            </>

           </div>
        )
}