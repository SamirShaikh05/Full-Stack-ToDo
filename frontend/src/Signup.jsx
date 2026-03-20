import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('login')) {
            navigate('/');
        }
    }, [])

    const signupUser = async (e) => {
        e.preventDefault();
        let result = await fetch('http://localhost:3000/signup', {
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
            name: "",
            email: "",
            password: ""
        })
    }
    return (
        <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800 mb-10">Sign up</h1>

            <form className="flex flex-col gap-4" onSubmit={signupUser}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="text-xl font-medium text-gray-600">Name</label>
                    <input
                        type="text"
                        id="name"
                        onChange={(event) => setUserData({ ...userData, name: event.target.value })}
                        value={userData.name}
                        placeholder="Enter Name"
                        className="border border-gray-200 rounded-lg px-4 py-2.5 text-md focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400"
                    />
                </div>

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
                    Sign up
                </button>
                <Link to="/login"><div className="text-gray-700 hover:text-gray-900 hover:underline hover:cursor-pointer mt-3">Already have an account? Login!</div></Link>
            </form>
        </div>
    );
}

export default Signup;