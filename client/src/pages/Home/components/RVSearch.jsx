import {useEffect, useReducer } from 'react';
import { getTodayPST } from '../../../util/getDate';
export default function RVSearch({ value, onSearchChange }) {
    
    const searchReducer = (searchValues, action)=>{
        let newValues = {...searchValues};
        switch(action.type){
            case "change-location":
                
                return {...newValues, location: action.payload.value}
            case "change-checkIn": { 
                const newCheckIn = action.payload.value;
                const newCheckOut = newValues.checkOut;
                if (newCheckIn > newCheckOut) {
                    return {
                        ...newValues,
                        checkIn: newCheckIn,
                        checkOut: newCheckIn
                    };
                }
            
                return {
                    ...newValues,
                    checkIn: newCheckIn
                }; 
            }
            case "change-checkOut":
                return {...newValues, checkOut: action.payload.value}   
            default:
                return searchValues;
        }
    }
    const [searchValues, dispatch] = useReducer(searchReducer, value)
    
    const handleChange = (e, type)=> {
        dispatch({type:type, payload:{value: e.target.value}})
    }
    const today = getTodayPST();
    console.log(today)
    useEffect(()=>{
        onSearchChange?.(searchValues)
    },[searchValues, onSearchChange])
    return(
        <>
        <div>
            <input type='text' value={searchValues.location} onChange={(e)=>handleChange(e, "change-location")} placeholder={"City"}/>
            <input 
                type="date" 
                value={searchValues.checkIn} 
                min={today} 
                onChange={(e)=>handleChange(e, "change-checkIn")}
                />
            <input 
                type="date" 
                value={searchValues.checkOut} 
                min={searchValues.checkIn} 
                onChange={(e)=>handleChange(e, "change-checkOut")}
                />
        </div>
        </>
    )
}