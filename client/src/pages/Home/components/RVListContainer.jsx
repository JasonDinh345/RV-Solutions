

import RV from "./RV";
export default function RVListContianer({ rvList, isLoading}){
    
    console.log(rvList)
    return(
        <>
       {isLoading ? (
        <>
        <h2>Loading...</h2>
        </>
       ):(
        <>
        <div id="rvListContainer">
            {rvList.map((rvData, i) =>{
                return <RV rvData={rvData} key={i+1}/>
            })}
        </div>
        </>
       )}
        </>
    )
}