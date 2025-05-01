import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import BookRVBox from "./components/BookRVBox";
import "./RVDescription.css"
export default function RVDescription(){
    const {vin} = useParams();
    const [RV, setRVData] = useState({})
    useEffect(() => {
        console.log("hi")
         axios.get(`http://localhost:1231/RV/${vin}`).then(res =>{
            console.log("yo")
            console.log(res.data)
            setRVData(res.data);
        }).catch(err =>{
            console.log("oy")
          console.error(err)
        })
      },[]);
      const isLoading = false;  
    return(
        <>
        {isLoading ? (
            <>
            <p>Loading...</p>
            </>
        ):(
            <>
            <div id="RVDescprition">
                
                    <div className="rvHeader">
                        <h1>{RV.Make}, {RV.Model}</h1>
                        <h2>{RV.Location}, WA</h2>
                    </div>
                    
                        <div id="rvSection1">
                            <div className="imgContainer">
                                <img src={RV.imageURL}></img>
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
        )}
        </>
    )
}