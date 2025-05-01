import { useNavigate } from "react-router-dom"

export default function RV({rvData}){
    const navigate = useNavigate();

    const handleOnClick = ()=>{
        navigate("/RV/" + rvData.VIN)
    }
    return(
        <>
        <div className="RV" onClick={handleOnClick}>
            <img src={rvData.imageURL}></img>
            <div className="rvText">
                <h3>{rvData.Location}</h3>
                <p>{rvData.Make}, {rvData.Model}</p>
                <p>Class: {rvData.SizeClass}</p>
                <p style={{fontWeight: "bold"}}>${rvData.CostToRent} per day</p>
            </div>
        </div>
        </>
    )
}