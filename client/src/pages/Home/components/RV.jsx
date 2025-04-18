import { useNavigate } from "react-router-dom"

export default function RV({rvData}){
    const navigate = useNavigate();

    const handleOnClick = ()=>{
        navigate("/RV/" + rvData.vin)
    }
    return(
        <>
        <div className="RV" onClick={handleOnClick}>
            <img src="/RV.jpg"></img>
            <div className="rvText">
                <h3>{rvData.city}</h3>
                <p>{rvData.make}, {rvData.model}</p>
                <p>Class: {rvData.class}</p>
                <p style={{fontWeight: "bold"}}>${rvData.cost_per_day} per day</p>
            </div>
        </div>
        </>
    )
}