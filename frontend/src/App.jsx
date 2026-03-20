import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"
import AddTask from "./AddTask"
import List from "./List"
import Signup from "./Signup"
import Login from "./Login"
import Protected from "./Protected"

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Protected><List/></Protected>}/>
        <Route path="/add" element={<Protected><AddTask /></Protected>}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
