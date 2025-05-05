import {useEffect, useReducer } from 'react';

export default function RVSearch({ value, onSearchChange, onSearch }) {
    
    const searchReducer = (searchValues, action)=>{
        let newValues = {...searchValues};
        switch(action.type){
            case "change-location":
                
                return {...newValues, Location: action.payload.value}
            case "change-class":
                return {...newValues, SizeClass: action.payload.value}
            default:
                return searchValues;
        }
    }
    const [searchValues, dispatch] = useReducer(searchReducer, value)
    
    const handleChange = (e, type)=> {
        dispatch({type:type, payload:{value: e.target.value}})
    }
    
    
    useEffect(()=>{
        onSearchChange?.(searchValues)
    },[searchValues, onSearchChange])
    return(
        <>
        <div id='RVSearchBox'>
            <input type='text' value={searchValues.location} onChange={(e)=>handleChange(e, "change-location")} placeholder={"City"}/>
            <div id="RVSearchClass">
                <p>RV Class:</p>
                <select defaultValue="" onChange={(e)=>{handleChange(e, "change-class")}}>
                        <option value="" >None</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                </select>
            </div>
            
            <div className='searchButton' onClick={onSearch}>
                 <img src='search.png'></img>
            </div>
        </div>
        </>
    )
}