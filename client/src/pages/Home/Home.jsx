
import { useEffect, useState } from "react";
import "./Home.css"
import RVSearch from "./components/RVSearch";
import RVListContianer  from "./components/RVListContainer"

import axios  from "axios";
export default function Home(){
    const [searchValues, setSearchValues] = useState({Location: "", SizeClass: ""})
    
    const handleSearchChange = (values)=>{
        setSearchValues(values)
    }
    
    const [rvList, setRVList] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [dataError, setError] = useState()
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const res = await axios.get("http://localhost:1231/RV");
          
            setRVList(res.data); 
            setFilteredRVs(res.data)
          } catch (err) {
            console.log(err);
            setError('Error fetching data');
          } finally {
            setLoading(false); 
          }
        };
    
        fetchData(); 
    
      }, []); 
        

    const [filteredRVs, setFilteredRVs] = useState(rvList)
     
    
    const handleSearch = ()=>{
            
    const newList = rvList.filter(rv =>
        (!searchValues.Location || rv.Location.includes(searchValues.Location)) &&
        (!searchValues.SizeClass || rv.SizeClass ===  searchValues.SizeClass) 
        );
        setFilteredRVs(newList)
            
        }
        
    return(
        <>
        <div id="homePage">
            
            <RVSearch value={searchValues} onSearchChange={(e)=>handleSearchChange(e)} onSearch={handleSearch}/>
                
            
            {isLoading ? (
                <p>Loading...</p>
                ) : dataError ? (
                <p>{dataError}</p>
                ):(
                    <RVListContianer rvList={filteredRVs}/>
                )}
        </div>
        </>
    )
}