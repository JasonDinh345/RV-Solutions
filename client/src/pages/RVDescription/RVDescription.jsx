import { useParams } from "react-router-dom"

import BookRVBox from "./components/BookRVBox";
import "./RVDescription.css"
import useGet from "../../hooks/useGet";

export default function RVDescription(){

    const {vin} = useParams();
    
    const { data: RV, isLoading, error} = useGet(`http://localhost:1231/RV/${vin}`, false)
    
    if(isLoading){
      return <p>Loading...</p>
    }else if(error){
      return <p>Error fetching data! {error}</p>
    }else if (!RV){
      return <p>Could not load RV data.</p>;
    }
    return(
        
            <>
            <div id="RVDescprition">
                
                    <div className="rvHeader">
                        <h1>{RV.Make}, {RV.Model}</h1>
                        <h2>{RV.City}, {RV.State}</h2>
                    </div>
                    
                        <div id="rvSection1">
                            <div className="imgContainer">
                                <img src={RV.ImageURL}></img>
                            </div>
                            <BookRVBox costPer={RV.CostToRent}/>
                        </div>
                    <div className="RVSpecs">
                            <h2>Specifications:</h2>
                            <ul>
                                <li>Class: {RV.SizeClass}</li>
                                
                                <li>Total Mileage: {RV.Mileage}</li>
                            
                            </ul>
                        </div>
                    
                    <h2>Description</h2>
                    <div className="RVTextDesc">
                        <p>{RV.Description}</p>
                    </div>
                    
                
                
            </div>
            </>
        
    )
}