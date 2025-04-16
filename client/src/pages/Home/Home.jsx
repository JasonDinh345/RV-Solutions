
import { useState } from "react";
import "./Home.css"
import RVSearch from "./components/RVSearch";
import { getTodayPST } from "../../util/getDate";
export default function Home(){
    const [searchValues, setSearchValues] = useState({location: "", checkIn: getTodayPST(), checkOut: getTodayPST()})

    const handleSearchChange = (values)=>{
        setSearchValues(values)
    }
    console.log(searchValues)
    return(
        <>
        <div id="homePage">
            <div id="searchBox">
                <RVSearch value={searchValues} onSearchChange={(e)=>handleSearchChange(e)}/>
                <button>Search</button>
            </div>
        </div>
        </>
    )
}