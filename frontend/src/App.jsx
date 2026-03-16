import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"
import AddTask from "./AddTask"
import List from "./List"

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<List/>}/>
        <Route path="/add" element={<AddTask />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
