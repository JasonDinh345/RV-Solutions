import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import NavBar from "./components/NavBar"
import "./assets/global.css"
function App() {
  return (
    <>
     <div id="wholePage">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
