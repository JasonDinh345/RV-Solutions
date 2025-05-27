

export default function RVSearch({ value, onSearchChange, onSearch }) {
    
    const handleChange = (e)=>{
        const {name, value}  = e.target;
        onSearchChange?.({...value, [name]:value})
    }
    return(
        <>
        <div id='RVSearchBox'>
            <input type='text' value={value.City} name="City"onChange={handleChange} placeholder={"City"}/>
            <input type='text' value={value.State} name="State"onChange={handleChange} placeholder={"State"}/>
            <div id="RVSearchClass">
                <p>RV Class:</p>
                <select defaultValue="" onChange={handleChange}>
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