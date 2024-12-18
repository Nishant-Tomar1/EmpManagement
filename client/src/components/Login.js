import React, { useState } from 'react'
import { useAlert } from '../store/contexts/AlertContextProvider';
import { useLogin } from "../store/contexts/LoginContextProvider"
import axios from 'axios'
import { extractErrorMessage, Server } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email : "",
        password : ""
    })
    const alertCtx = useAlert();
    const loginCtx = useLogin();
    const navigate = useNavigate();
    

    const handleUserChange = (e) => {
        const {name, value} = e.target;
        setUser(user => ({...user,
            [name] : value,
        }))
    }

    const handleSumbit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${Server}/users/login`,{
              email : user.email,
              password : user.password
            });
            if (res.status === 200){
              const data = res?.data?.data
              loginCtx.login(data.user._id, data.user.name, data.user.role, data.token);
              alertCtx.setToast("success","Logged In successfully");
              navigate("/");
            }   
            setLoading(false);
        } catch (error) {
            alertCtx.setToast("error", extractErrorMessage(error?.response?.data));    
            setLoading(false)
            // console.log(extractErrorMessage(error?.response?.data));
          }
    }
  return (
  <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
    <form action="" onSubmit={handleSumbit} className="bg-gray-200 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
      <div className='w-full text-3xl text-center'>Login</div>
      <label htmlFor="">Email</label>
      <input type="text" value={user.email} name="email" onChange={handleUserChange} className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
      <label htmlFor="">Password</label>
      <input type="text" value={user.password} name="password" onChange={handleUserChange} className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
      <button type="submit" className="w-full px-4 py-2 bg-green-400 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-50">
        {loading ? "loading..." : "Login"}
      </button>
    <Link to="/forgotpassword" className="text-blue-500 hover:underline">Forgot Password?</Link>
    </form>
</div>
  )
}

export default Login
