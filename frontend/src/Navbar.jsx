import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const [login, setLogin] = useState(localStorage.getItem('login'))
    useEffect(()=>{
        const handleStorage = ()=>{
            setLogin(localStorage.getItem('login'))
        }
        window.addEventListener("localStorage-change", handleStorage);

        return()=>{
            window.removeEventListener("localStorage-change", handleStorage)
        }
    },[])

    const navigate = useNavigate();


    const handleLogout = () =>{
        localStorage.removeItem('login')
        setLogin(null);
        setTimeout(() => {  
            navigate('/login')
        }, 0);
    }
    return (
        <>
            <div className="w-full h-16 bg-black flex items-center justify-between px-10 select-none">
                <span className="text-white font-bold text-3xl">To-Do</span>
                <div className="flex gap-15 items-center justify-center">
                    {
                        login &&
                        <>
                            <span className="text-white text-lg hover:cursor-pointer hover:underline"><Link to='/'>List</Link></span>
                            <span className="text-white text-lg hover:cursor-pointer hover:underline"><Link to='/add'>Add-Task</Link></span>
                            <span className="text-white text-lg hover:cursor-pointer hover:underline"><Link onClick={handleLogout}>Log out</Link></span>
                        </>
                    }

                </div>
            </div>
        </>
    )
}
export default Navbar;