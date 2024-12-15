import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { extractErrorMessage, Server } from '../constants'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../store/contexts/AlertContextProvider'
import Loader from "../components/Loader"
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState("")
    const [steps, setSteps] = useState({
        1 : false,
        2 : false,
        3 : true
    })
    const [code , setCode] = useState("")
    const [actualCode, setActualCode] = useState()
    const [email, setEmail] = useState("")
    const [showpassword, setShowPassword] = useState(false)
    const [showpassword2, setShowPassword2] = useState(false)
    const [newPassword, setNewPassword] = useState({P1:"", P2 : ""})

    const navigate = useNavigate()
    const alertCtx = useAlert()

    useEffect(() => {
        setActualCode(Math.floor((Math.random()*899990)) + 100000) ;
    },[])
    
    const handleClick = async (e)=>{
        e.preventDefault()
        console.log("clicked");
        
        if(!email){
            return alertCtx.setToast("warning","Please enter your email !")
        }
        setLoading(true);
        try {
            const res = await axios.post(`${Server}/users/verifyemail`,{"email" : email.toLowerCase()})
            
            if (res.data.statusCode === 200){
                setId(res.data.data)
                const resp = await axios.post(`${Server}/users/sendemail`,{
                    "email" : email.toLowerCase() , 
                    "subject":"Password Reset Code", 
                    "message": `${actualCode} is your password reset Code. Enter the Code in the website to create New Password.`
                })
                
                if (resp.data.statusCode === 200){
                    setLoading(false);
                    alertCtx.setToast("success","Verification code sent Successfully!")
                    setSteps(prev => ({...prev,1:false,2:true}))        
                }
            }
        } catch (error) {
            setLoading(false)
            console.log(error);           
            alertCtx.setToast("error", extractErrorMessage(error.response.data))
        }
    }

    const handleCodeSubmit = async(e) => {
        e.preventDefault()
        if(!code){
            return alertCtx.setToast("warning","Enter Verification code  !")
        }
        if (Number.parseInt(code) !== actualCode){
            return alertCtx.setToast("error","Wrong Verification Code")
        }
        setLoading(true)
        setTimeout(() => {
            alertCtx.setToast("success","Verification Successful")
            setSteps(prev => ({...prev, 2 : false, 3: true}))
            setLoading(false)
        }, 800); 
    }

    const handlePasswordChange = async (e)=>{
        e.preventDefault();
        try {
            if (newPassword.P1 !== newPassword.P2){
                return alertCtx.setToast("warning","Both passwords should match")
            }
            
            if (newPassword.P1.length < 6){
                return alertCtx.setToast("warning", "Password must be at least 6 characters long!");
            }

            setLoading(true)
            const res = await axios.post(`${Server}/users/change-password-by-code`,{
                "id" : id,
                "newPassword" : newPassword.P1
            })
            if (res.data.statusCode === 200){
                setTimeout(() => {
                    alertCtx.setToast("success","Password Changed Successfully! \n Login again to continue")
                    setLoading(false)
                    navigate("/auth")
                }, 800); 
            }
            else{
                setLoading(false);
                alertCtx.setToast("Error","Something wrong happened! Please try again")
                navigate("/forgotpassword")
            }
            
        } catch (error) {
            setLoading(false);
            console.log(error);
            alertCtx.setToast("Error","Something wrong happened! Please try again")
            navigate("/forgotpassword")
        }

    }

  return (
    <>
    <div className='cursor-pointer text-3xl p-2' onClick={()=>{navigate("/auth")}}><IoMdArrowRoundBack/></div>
    <div  className="flex flex-col w-full items-center bg-gray-100 dark:bg-[#191919] dark:text-white justify-center min-h-[70vh]">
        {steps[1] && <div className='flex flex-col w-full items-center justify-center '>
            <h1 className='text-xl lg:text-2xl font-bold mb-5'>Forgot Password ?</h1>
            <form className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" action="" onSubmit={handleClick}>
            <input type="email" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-4 p-2.5 dark:bg-[#232323] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder='Enter Your Email' value={email} onChange={e=> setEmail(e.target.value)}/><br />
            <button disabled={loading ? true : false} type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loading ? <Loader size='md'/> : "Get Code on Email" }
            </button>
            <p  className="w-full text-center mt-3 text-sm  opacity-40"> Warning! Do not refresh the page</p>
            </form>
            </div>
        }
        {steps[2] && <div className='flex flex-col w-full items-center justify-center '>
                <h1 className='text-xl lg:text-2xl font-semibold mb-5 text-gray-700 dark:text-white'>Enter Verification Code </h1>
                <form className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" action="" onSubmit={handleCodeSubmit}>
                <input className="shadow-md mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 ps-4 dark:bg-[#232323] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " type="text" value={code} onChange={e => setCode(e.target.value)} placeholder='Verification code'/>
                <button type="submit" disabled={loading ? true : false} className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">
                { loading ? <Loader size='md'/> : "Verify" } 
                </button>
                <p  className="w-full text-center mt-3 text-sm  opacity-40"> Warning! Do not refresh the page</p>
                </form>
            </div>
        }
        {steps[3] && <div className='flex flex-col w-full items-center justify-center '>
                <h1 className='text-xl lg:text-2xl font-semibold mb-5 text-gray-700 dark:text-white'>Create New Password</h1>
                <form action="" className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" onSubmit={handlePasswordChange}>
                <div className="mb-4">
                    <label name="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">New Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="New Password" value={newPassword.P1} onChange={e => setNewPassword(prev => ({...prev, P1 : e.target.value}))}/>
                        <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50      border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <label name="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">Confirm New Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword2 ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="Confirm New Password" value={newPassword.P2} onChange={e => setNewPassword(prev => ({...prev, P2 : e.target.value}))}/>
                        <div onClick={()=>{setShowPassword2(!showpassword2)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50      border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword2 ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <p className='text-center'><span className='font-bold'>Note : </span>Password should be at least 6 characters long, should include letters, numbers and special characters.</p> <br />
                <button type='submit' disabled={loading ? true : false} className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loading ? <Loader size='md'/> : "Submit" } </button>
                <p  className="w-full text-center mt-3 text-sm  opacity-40"> Warning! Do not refresh the page</p>
                </form>

            </div>
        }
    </div>
    </>
  )
}

export default ForgotPassword
