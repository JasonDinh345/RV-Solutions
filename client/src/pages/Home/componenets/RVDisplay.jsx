
import useGet from "../../../hooks/useGet"
import { useNavigate } from "react-router-dom"
export default function RVDisplay({imageData}){
    const navigate = useNavigate();
    
 
    return(
        <>
        <div id="RVDisplay" >
            <img 
                src={imageData.ImageURL}
                alt="Slideshow"
                    
            />
        </div>
        </>
    )
}