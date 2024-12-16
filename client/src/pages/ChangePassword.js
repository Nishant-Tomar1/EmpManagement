import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAlert } from '../store/contexts/AlertContextProvider'
import axios from 'axios'
import { extractErrorMessage, Server } from '../constants'
import Loader from '../components/Loader'
import { IoMdArrowRoundBack } from "react-icons/io";

function ChangePassword() {
    const [loading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("")
    const [showpassword, setShowPassword] = useState(false)
    const [showpassword2, setShowPassword2] = useState(false)

    const alertCtx = useAlert()
    const navigate =  useNavigate()


    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        if (!oldPassword || !newPassword) return alertCtx.setToast("warning","Enter both Passwords")
        if (newPassword.length < 6) return alertCtx.setToast("warning","New Password must be at least 6 characters long!")
        if (oldPassword === newPassword) return alertCtx.setToast("warning","New Password must be different from old password!")
        try {
            setLoading(true)
            const res = await axios.post(`${Server}/users/change-current-user-password`,{"oldPassword":oldPassword,"newPassword":newPassword},{withCredentials:true})
            if (res.data.statusCode === 200){
                setLoading(false)
                alertCtx.setToast("success","Password changed successfully")
                navigate("/")
            }
        } catch (error) {
            setLoading(false)
            alertCtx.setToast("error",extractErrorMessage(error?.response?.data))
        }
    }

    return (
        <>
            <div className='cursor-pointer text-3xl p-2' onClick={()=>{navigate("/")}}><IoMdArrowRoundBack/></div>
        <div  className="flex flex-col w-full items-center bg-gray-100 dark:bg-[#191919] dark:text-white justify-center min-h-[70vh]">
            <div className='flex flex-col w-full items-center justify-center '>
                <h1 className='text-xl lg:text-2xl font-semibold mb-5 text-gray-700 dark:text-white'>Update Password</h1>
                <form action="" className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                    <label name="oldPassword" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">Old Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword ? "text" : "password"} autoComplete="off" name="oldPassword" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="Old Password" value={oldPassword} 
                        onChange={ (e) => setOldPassword(e.target.value)}/>
                        <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50      border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <label name="newPassword" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">New Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword2 ? "text" : "password"} autoComplete="off" name="newPassword" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                        <div onClick={()=>{setShowPassword2(!showpassword2)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50 border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword2 ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <button type='submit' className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loading ? <Loader size='md'/> : "Submit" } </button>
                </form>

            </div>
        </div>
        </>
    )
}

export default ChangePassword
