import React, {  useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAlert } from '../store/contexts/AlertContextProvider'
import axios from 'axios'
import { extractErrorMessage, Server } from '../constants'
import Loader from '../components/Loader'
import { IoIosArrowBack } from "react-icons/io";

function CreatePassword() {
    const [loading, setLoading] = useState(false)
    const [validUser, setValidUser] = useState(false);
    const [user, setUser] = useState({});
    const [wait, setWait] = useState(false);
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showpassword, setShowPassword] = useState(false)
    const [showpassword2, setShowPassword2] = useState(false)

    const alertCtx = useAlert()
    const navigate =  useNavigate()
    const {userId} = useParams()

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        if (!password || !confirmPassword) return alertCtx.setToast("warning","Enter both Passwords")
        if (password.length < 6) return alertCtx.setToast("warning","Password must be at least 6 characters long!")
        if (password !== confirmPassword) return alertCtx.setToast("warning","Both password should match")
        try {
            setWait(true)
            const res = await axios.post(`${Server}/users/create-password`,{"userId":userId,"password":password})
            if (res.data.statusCode === 200){
                setWait(false)
                alertCtx.setToast("success","Password updated successfully!! You can login with new password")
                navigate("/auth")
            }
        } catch (error) {
            setWait(false)
            alertCtx.setToast("error",extractErrorMessage(error?.response?.data))
        }
    }

    const fetchUser = async() => {
        if (userId.length !== 24){
            setLoading(false);
            return alertCtx.setToast("error","Invalid userId!!");
        }
        try {
            const res = await axios.get(`${Server}/users/getusers?userId=${userId}`);
            if (res?.data?.statusCode === 200){
                setUser(res?.data?.data[0]);
                setValidUser(true);
                setLoading(false);
                return;
            }
        } catch (error) {
            setLoading(false);
            alertCtx.setToast("error","User not found! Contact your manager")
        }
    } 

    useEffect(()=>{
        setLoading(true);
        fetchUser();
    },[])

    return (
        <>
        { !loading ?  
        <>
         <div className='flex cursor-pointer text-2xl items-center font-bold p-2' onClick={()=>{navigate("/auth")}}><IoIosArrowBack/> Back</div>
        {
            validUser ? 
            <div className="flex flex-col w-full items-center dark:bg-[#191919] dark:text-white justify-center min-h-[60vh]">
        <h2 className='text-xl lg:text-2xl font-bold mb-5 text-gray-700 dark:text-white'>WELCOME, {user?.name?.toUpperCase()}</h2>
            {!user?.passwordCreated ? <div className='flex flex-col w-full items-center justify-center '>
                <h2 className='text-xl lg:text-2xl font-semibold mb-5 text-gray-700 dark:text-white'>Update Password</h2>
                <form action="" className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                    <label name="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">Enter Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="Enter password" value={password} 
                        onChange={ (e) => setPassword(e.target.value)}/>
                        <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50      border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <label name="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">Confirm Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword2 ? "text" : "password"} autoComplete="off" name="confirmPassword" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        <div onClick={()=>{setShowPassword2(!showpassword2)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50 border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword2 ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <button type='submit' className="w-full shadow-lg text-white bg-green-400 hover:bg-green-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-green-400 dark:hover:bg-green-600 ">{ wait ? <Loader size='md' color='success'/> : "Submit" } </button>
                   <div className=' text-sm mt-1 text-gray-500 text-center'> Warning : This link can be used for changing password only once. </div>
                </form>

            </div>
            :
            <div className='text-center px-2'>Your password Update code is expired. Contact your manager.</div>}
            </div>
        :
            <div className="flex flex-col w-full items-center dark:bg-[#191919] dark:text-white justify-center min-h-[80vh]">
            <h1 className=' font-bold'>User Not found!!</h1>
            </div>
        }
        </>
            :
            <div className='flex items-center justify-center min-h-[80vh]'>Loading...</div>
        }
        </>
    )
}

export default CreatePassword
