

import RV from "./RV";
export default function RVListContianer({ rvList}){
    
    
    return(
        <>
       
        
        <div id="rvListContainer">
            {rvList.map((rvData, i) =>{
                return <RV rvData={rvData} key={i+1}/>
            })}
        </div>
        

        </>
    )
}