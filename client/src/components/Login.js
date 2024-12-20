import React, { useState } from 'react'
import { useAlert } from '../store/contexts/AlertContextProvider';
import { useLogin } from "../store/contexts/LoginContextProvider"
import axios from 'axios'
import { extractErrorMessage, Server } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from "../assets/logos/logo.png"
import Loader from './Loader';
import { FaRegEye,FaRegEyeSlash } from 'react-icons/fa';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name : "",
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
              name : user.name,
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
            console.log(error);
          }
    }
    return (

    <div className="flex flex-col text-gray-700 md:flex-row min-h-screen">
          {/* Left Section */}
          <div className="md:flex-1 min-h-[50vh] bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col justify-center items-center p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">We are more than just a company</h1>
            <p className="text-center text-gray-400 max-w-md">
              “Feed a man, clothe him, give him decent quarters to live and you'll find a man with self-respect, ready to contribute and become a productive human being.”
            </p>
          </div>

          {/* Right Section */}
          <div className="md:flex-1 bg-white flex flex-col justify-center items-center p-8">
            <div className="flex flex-col items-center w-full max-w-md">
              <div className="text-6xl font-bold mb-4"><img src={logo} alt="" className='w-20 md:w-24' /></div>
              <h2 className="text-xl md:text-xl font-bold mb-2 text-center text-gray-700">Employee Assessment</h2>
              {/* <p className="text-gray-600 mb-2 text-center">Please login to your account</p> */}

              <form onSubmit={handleSumbit} className="w-full px-4 space-y-2">
              <div>
                  <label className="block text-xs font-medium text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name = "name"
                    onChange = {handleUserChange}
                    value={user.name}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your Name"
                  />
                </div>

                <div className='flex font-semibold w-full text-center items-center justify-center'>OR</div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name = "email"
                    value={user.email}
                    onChange = {handleUserChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your Email"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="password">
                    Password*
                  </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={user.password}
                      onChange={handleUserChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute  right-1 px-3 py-3 text-lg text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <FaRegEye/> : <FaRegEyeSlash/>}
                    </button>
                      <Link to="/forgotpassword" className='text-sm mb-4 text-blue-500 cursor-pointer hover:underline'> Forgot Password ?</Link>
                  </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                >
                  {loading ? <Loader size='md' color='success'/> : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
  )
}

export default Login
