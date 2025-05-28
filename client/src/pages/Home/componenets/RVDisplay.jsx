
import useGet from "../../../hooks/useGet"
import { useNavigate } from "react-router-dom"
export default function RVDisplay({imageData}){
    const navigate = useNavigate();
    const {data:RV, isLoading} = useGet(`http://localhost:1231/RV/${imageData.VIN}`)
 
    return(
        <>
        <div id="RVDisplay" >
            {RV && !isLoading && (
                <div className="RVDisplay-Overlay" onClick={()=>navigate(`/RV/${RV.VIN}`)}>
                    <h2>{RV.Make}, {RV.Model}</h2>
                </div>
            )}
            <img 
                src={imageData.ImageURL}
                alt="Slideshow"
                    
            />
        </div>
        </>
    )
}