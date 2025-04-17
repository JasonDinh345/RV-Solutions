
import { useState } from "react";
import "./Home.css"
import RVSearch from "./components/RVSearch";
import RVListContianer  from "./components/RVListContainer"
import { getTodayPST,getDatePST } from "../../util/getDate";
export default function Home(){
    const [searchValues, setSearchValues] = useState({location: "", checkIn: getTodayPST(), checkOut: getTodayPST()})
    
    const handleSearchChange = (values)=>{
        setSearchValues(values)
    }
    
   
    //const {rvList, isLoadind, error} = useAxios(insert url);
        
        //TEMP VAR FOR DB
        let initialRVList = [
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
        const [rvList, setRVList] = useState(initialRVList)   
        const isLoading = false;
       
        //TEMP VAR FOR DB  
        const [filteredRVs, setFilteredRVs] = useState(rvList)
        const handleSearch = ()=>{
            
            const newList = rvList.filter(rv =>
                (!searchValues.location || rv.city.includes(searchValues.location)) &&
                (!searchValues.checkIn || rv.availStart <= searchValues.checkIn) &&
                (!searchValues.checkOut  || rv.availEnd >= searchValues.checkOut)
            );
            setFilteredRVs(newList)
            
        }
    console.log(filteredRVs)
    return(
        <>
        <div id="homePage">
            
            <RVSearch value={searchValues} onSearchChange={(e)=>handleSearchChange(e)} onSearch={handleSearch}/>
                
            
            <RVListContianer isLoading={isLoading} rvList={filteredRVs}/>
        </div>
        </>
    )
}