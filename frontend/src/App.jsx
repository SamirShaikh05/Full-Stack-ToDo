import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<h1 className="text-3xl text-black font-semibold m-5">Task List</h1>}/>
        <Route path="/add" element={<h1 className="text-3xl text-black font-semibold m-5">Add Task</h1>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
