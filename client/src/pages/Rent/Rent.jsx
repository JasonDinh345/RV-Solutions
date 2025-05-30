
import { useEffect, useState } from "react";
import "./Rent.css"
import RVSearch from "./components/RVSearch";
import RVListContianer  from "./components/RVListContainer"
import useAxiosSubmit from "../../hooks/useAxiosSubmit";

import useGet from "../../hooks/useGet";
export default function Rent(){
    
    const {data: rvList, isLoading, error} = useGet(`http://localhost:1231/RV`, false)
    const [filteredRVs, setFilteredRVs] = useState([])
    const {sendRequest, loading} = useAxiosSubmit();
    
    useEffect(() => {
      if (rvList) {
        setFilteredRVs(rvList);
      }
    }, [rvList]);
   
            

    const onSearch = async(searchOptions)=>{
      try{
            const result = await sendRequest({
                method: "get",
                url: `http://localhost:1231/RV`,
                params: searchOptions
            })
           
            if(result){
               setFilteredRVs(result.data)
            }else{
              setFilteredRVs([])
            }
        }catch(err){
            setFilteredRVs([])
            console.log(err)
        }
    }
   
    if(!rvList  && isLoading){
      return <p>Couldn't load RVs</p>
    }
    return(
        <>
        <div id="rentPage">
            
            <RVSearch onSearch={onSearch}/>
                
            
            {isLoading || loading ? (
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