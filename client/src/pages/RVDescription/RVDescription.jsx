//import { useParams } from "react-router-dom"
import { getTodayPST, getDatePST, reformatDate } from "../../util/dataUtil";
import "./RVDescription.css"
export default function RVDescription(){
    //const {vin} = useParams();
    //const {RV, isLoading, error} = useAxios(search rv by vin);
    // Sample Data
    const RV = {
                    length_ft:17.8, 
                    width_ft:6.9, height_ft:9.3, 
                    class: "B", 
                    make: "Jayco", 
                    model:"2025 Comet", 
                    vin: "3C6LRVBG4PE500343", 
                    mileage: 1234, 
                    cost_per_day: 100, 
                    city: "Tacoma", 
                    availStart: getTodayPST(), 
                    availEnd:getDatePST(7)
                }
    const isLoading = false;
    //
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
                    <h1>{RV.make}, {RV.model}</h1>
                    <h2>{RV.city}</h2>
                </div>
                <div id="rvSection1">
                    <div className="imgContainer">
                        <img src="/RV.jpg"></img>
                    </div>
                    <div className="RVSpecs">
                        <h2>Specifications:</h2>
                        <ul>
                            <li>Class: {RV.class}</li>
                            <li>Dimensions: {RV.length_ft}ft x {RV.width_ft}ft x {RV.height_ft}ft</li>
                            <li>Total Mileage: {RV.mileage}</li>
                            <li>Available from {reformatDate(RV.availStart)} to {reformatDate(RV.availEnd)}</li>
                        </ul>
                    </div>
                </div>
                
                
                <h2>Description</h2>
                <div className="RVTextDesc">

                </div>
            </div>
            </>
        )}
        </>
    )
}