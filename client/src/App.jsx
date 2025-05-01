import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import NavBar from "./components/NavBar"
import "./assets/global.css"
import RVDescription from "./pages/RVDescription/RVDescription"
import Login from "./pages/Login/Login"
function App() {
  return (
    <>
     <div id="wholePage">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/RV/:vin" element={<RVDescription/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
