import { useEffect, useState } from "react"
//import useAxios from "../../../hooks/useAxios";
import { getDatePST, getTodayPST } from "../../../util/getDate";
import RV from "./RV";
export default function RVListContianer({filter}){
    //const {rvList, isLoadind, error} = useAxios(insert url);
    
    //TEMP VAR FOR DB
    const rvList = [
        {
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
        },{
            length_ft: 19.5,
            width_ft: 7.8,
            height_ft: 9.5,
            class: "B",
            make: "Winnebago",
            model: "2024 Solis 59P",
            vin: "WGWFBX20PFG000221",
            mileage: 1500,
            cost_per_day: 150,
            city: "Seattle",
            availStart: getTodayPST(), 
            availEnd: getDatePST(10) 
        },
        {
            length_ft: 16.5,
            width_ft: 7.0,
            height_ft: 9.0,
            class: "A",
            make: "Airstream",
            model: "2022 Basecamp 16",
            vin: "1STBR16T3KJ000666",
            mileage: 800,
            cost_per_day: 90,
            city: "Spokane",
            availStart: getTodayPST(), 
            availEnd: getDatePST(3) 
        }]
    const isLoading = false;
    //TEMP VAR FOR DB  
    console.log(rvList)
    return(
        <>
       {isLoading ? (
        <>
        <h2>Loading...</h2>
        </>
       ):(
        <>
        <div id="rvListContainer">
            {rvList.map((rvData, i) =>{
                return <RV rvData={rvData} key={i+1}/>
            })}
        </div>
        </>
       )}
        </>
    )
}