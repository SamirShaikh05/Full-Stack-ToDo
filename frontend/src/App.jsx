import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"
import AddTask from "./AddTask"
import List from "./List"
import Signup from "./Signup"
import Login from "./Login"

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<List/>}/>
        <Route path="/add" element={<AddTask />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
