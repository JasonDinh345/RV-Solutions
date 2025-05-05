
import { useEffect, useState } from "react";
import "./Rent.css"
import RVSearch from "./components/RVSearch";
import RVListContianer  from "./components/RVListContainer"


import useGet from "../../hooks/useGet";
export default function Rent(){
    const [searchValues, setSearchValues] = useState({Location: "", SizeClass: ""})
    const {data: rvList, isLoading, error} = useGet(`http://localhost:1231/RV`, false)
    const [filteredRVs, setFilteredRVs] = useState([])
    const handleSearchChange = (values)=>{
        setSearchValues(values)
    }
    
    useEffect(() => {
      if (rvList) {
        setFilteredRVs(rvList);
      }
    }, [rvList]);
    const handleSearch = ()=>{
            
    const newList = rvList.filter(rv =>
        (!searchValues.Location || rv.Location.includes(searchValues.Location)) &&
        (!searchValues.SizeClass || rv.SizeClass ===  searchValues.SizeClass) 
        );
        setFilteredRVs(newList)
            
        }
    if(!rvList  && isLoading){
      return <p>Couldn't load RVs</p>
    }
    return(
        <>
        <div id="rentPage">
            
            <RVSearch value={searchValues} onSearchChange={(e)=>handleSearchChange(e)} onSearch={handleSearch}/>
                
            
            {isLoading ? (
                <p>Loading...</p>
                ) : error ? (
                <p>{error}</p>
                ):(
                    <RVListContianer rvList={filteredRVs}/>
                )}
        </div>
        </>
    )
}