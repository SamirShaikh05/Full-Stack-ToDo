import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('login')) {
            navigate('/');
        }
    }, [])
    const loginUser = async (e) => {
        e.preventDefault();
        let result = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        result = await result.json()

        if (result.success) {
            document.cookie = "token=" + result.token;
            localStorage.setItem('login', userData.email);
            navigate('/')
        }
        else {
            alert(result.msg)
        }
        setUserData({
            email: "",
            password: ""
        })
    }
    return (
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800 mb-10">Login</h1>

            <form className="flex flex-col gap-4" onSubmit={loginUser}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-xl font-medium text-gray-600">Email</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(event) => setUserData({ ...userData, email: event.target.value })}
                        value={userData.email}
                        placeholder="Enter Email"
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-md focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400 resize-none"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-xl font-medium text-gray-600">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(event) => setUserData({ ...userData, password: event.target.value })}
                        value={userData.password}
                        placeholder="Enter Password"
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-md focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400 resize-none"
                    />
                </div>

                <button type="submit" className="mt-2 bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-700 transition-colors">
                    Login
                </button>
                <Link to="/signup"><div className="text-gray-700 hover:text-gray-900 hover:underline hover:cursor-pointer mt-3">Don't have an account? Make one!</div></Link>
            </form>
        </div>
    );
}

export default Login;