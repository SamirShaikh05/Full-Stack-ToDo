import { Link } from "react-router-dom";

function Navbar(){
    return(
        <>
            <div className="w-full h-16 bg-black flex items-center justify-between px-10 select-none">
                <span className="text-white font-bold text-3xl">To-Do</span>
                <div className="flex gap-15 items-center justify-center">
                    <span className="text-white text-lg hover:cursor-pointer hover:underline"><Link to='/'>List</Link></span>
                    <span className="text-white text-lg hover:cursor-pointer hover:underline"><Link to='/add'>Add-Task</Link></span>
                </div>

            </div>
        </>
    )
}
export default Navbar;