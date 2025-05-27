import { useState } from "react";
import { useRV } from "../../../../hooks/useRV";
import MyRVUpdateForm from "./MyRVUpdateForm";
export default function MyRVDescription(){
    const [isUpdating, setIsUpdating] = useState(false)
    const {RV} = useRV();
  
    return(
        <>
        {RV && 
            <>
            <div id="myRVDesc">
                <h1>{RV.Make}, {RV.Model}</h1>

                <img className="defaultBorder-thick"src={RV.ImageURL}></img>
                <h3>Location: <span>{RV.City}, {RV.State}</span></h3>
                <h3>VIN: <span>{RV.VIN}</span></h3>
                <h3>Size Class: <span>{RV.SizeClass}</span></h3>
                <h3>Cost to Rent: <span>${RV.CostToRent}</span></h3>
                <h3>Description:</h3>
                <p><span>{RV.Description}</span></p>
                <button className="myRVUpdateButton defaultBorder-thin" onClick={()=> setIsUpdating(true)}>Update</button>
            </div>
            {isUpdating &&
                <MyRVUpdateForm onExit={()=>setIsUpdating(false)}/>
            }
            </>
        }
        </>
    )
}