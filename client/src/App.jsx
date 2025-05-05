import { Route, Routes } from "react-router-dom"
import Rent from "./pages/Rent/Rent"
import NavBar from "./components/NavBar"
import "./assets/global.css"
import RVDescription from "./pages/RVDescription/RVDescription"
import Login from "./pages/Login/Login"
import Host from "./pages/Host/Host"
import AccountInfo from "./pages/AccountInfo/AccountInfo"
function App() {
  return (
    <>
     <div id="wholePage">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Rent/>}/>
        <Route path="/RV/:vin" element={<RVDescription/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/host" element={<Host/>}/>
        <Route path="/accountInfo" element={<AccountInfo/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
