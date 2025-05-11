import { useState } from "react"

export default function MyRVInfo({rvData}){
    const [currentTab, setCurrentTab] = useState("Info")
    return(
        <div className="darkBG">
            <div>
                <div className="rvInfoSideBar">
                    <h3>Info</h3>
                    <h3>Bookings</h3>
                    <h3>Damage Reports</h3>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}