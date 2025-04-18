import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import NavBar from "./components/NavBar"
import "./assets/global.css"
import RVDescription from "./pages/RVDescription/RVDescription"
function App() {
  return (
    <>
     <div id="wholePage">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/RV/:vin" element={<RVDescription/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
