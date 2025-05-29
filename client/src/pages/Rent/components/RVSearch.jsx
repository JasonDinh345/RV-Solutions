import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth"; 
export default function RVSearch({onSearch }) {
    const [searchOptions, setSearchOptions] = useState({})
    const {account} = useAuth();
    useEffect(() => {
    if (account) {
        const updatedOptions = { ...searchOptions, AccountID: account.AccountID };
        setSearchOptions(updatedOptions);
        onSearch(updatedOptions); 
    }
    }, [account]);
    const handleChange = (e)=>{
        const {name, value}  = e.target;
        setSearchOptions({...searchOptions, [name]:value})
        
    }
    
    console.log(searchOptions)
    return(
        <>
        <div id='RVSearchBox'>
            <input type='text' value={searchOptions.City|| ""} name="City"onChange={handleChange} placeholder={"City"}/>
            <input type='text' value={searchOptions.State|| ""} name="State"onChange={handleChange} placeholder={"State"}/>
            <div id="RVSearchClass">
                <p>RV Class:</p>
                <select defaultValue="" onChange={handleChange}>
                        <option value="" >None</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                </select>
            </div>
            
            <div className='searchButton' onClick={()=>onSearch(searchOptions)}>
                 <img src='search.png'></img>
            </div>
        </div>
        </>
    )
}