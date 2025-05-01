
import { useEffect, useState } from "react";
import "./Home.css"
import RVSearch from "./components/RVSearch";
import RVListContianer  from "./components/RVListContainer"
import useAxios from "../../hooks/useAxios";
import axios  from "axios";
export default function Home(){
    const [searchValues, setSearchValues] = useState({location: "", sizeClass: ""})
    
    const handleSearchChange = (values)=>{
        setSearchValues(values)
    }
    
   
    //const {rvList, isLoading, error} = useAxios("http://localhost:4000/RV");
        
     const [rvList, setRV] = useState([])
     const [filteredRVs, setFilteredRVs] = useState(rvList)
     useEffect(() => {
        console.log("hi")
         axios.get('http://localhost:1231/RV').then(res =>{
            console.log("yo")
            console.log(res.data)
            setRV(res.data);
        }).catch(err =>{
            console.log("oy")
          console.error(err)
        })
      },[]);
       
    
    const handleSearch = ()=>{
            
    const newList = rvList.filter(rv =>
        (!searchValues.Location || rv.city.includes(searchValues.Location)) &&
        (!searchValues.SizeClass || rv.class ===  searchValues.SizeClass) 
        );
        setFilteredRVs(newList)
            
        }
 
    const isLoading = false

    return(
        <>
        <div id="homePage">
            
            <RVSearch value={searchValues} onSearchChange={(e)=>handleSearchChange(e)} onSearch={handleSearch}/>
                
            
            <RVListContianer isLoading={isLoading} rvList={rvList}/>
        </div>
        </>
    )
}