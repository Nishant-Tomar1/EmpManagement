import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {extractErrorMessage, Server} from "../constants.js"
import Loader from "../components/Loader"
import { useAlert } from '../store/contexts/AlertContextProvider'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'

function Register() {
  const [loading, setLoading] = useState(false)
  const [admins, setAdmins] = useState([]);
  const [batches, setBatches] = useState([]);
  const [newUser , setNewUser] = useState({
    name : "",
    email : "",
    designation : "",
    role : "",
    manager : "",
    batch : "",
    customBatch : "",
    password : "",
  })
  const [showpassword, setShowPassword] = useState(false);

  const alertCtx = useAlert();
  const navigate = useNavigate();

  const fetchAdmin = async () => {
    try {
      const res = await axios.get(`${Server}/users/getusers?role=admin`);
      if (res?.data?.statusCode === 200){
        setAdmins(res?.data?.data)
        // console.log(res?.data?.data)
      }
    } catch (error) {
      console.log(extractErrorMessage(error?.response?.data));
    }
  }

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${Server}/users/get-batches?all=true`,{withCredentials:true});
      if (res?.data?.statusCode === 200){
        setBatches(res?.data?.data?.batches)
        // console.log(res?.data?.data?.batches);
      }
    } catch (error) {
      console.log(extractErrorMessage(error?.response?.data));
    }
  }

  const handleNewUserChange = (e)=> {
    setNewUser(prev => ({
      ...prev,
      [e.target.name] : e.target.value
    }))
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    for (const key in newUser){
      if (key==="manager" && newUser.role==="user" && newUser[key]===""){
        return alertCtx.setToast("warning",`${key} is required!`)
      }
      else if(newUser[key]==="" && key!=="customBatch" && key!=="manager"){
        return alertCtx.setToast("warning", `${key} is required!`)
      }
      else if (key==="customBatch" && newUser.batch==="other" && newUser[key]===""){
        return alertCtx.setToast("warning","Enter the batch name")
      }
    }
    if(newUser.password.length < 6 ){
      return alertCtx.setToast("warning", "Password must be at least 6 characters long")
    }
    
    try {
      setLoading(true);
      const res = await axios.post(`${Server}/users/register`, {
        name : newUser.name,
        email : newUser.email.toLowerCase(),
        password : newUser.password,
        designation : newUser.designation,
        role : newUser.role.toLowerCase(),
        managerId : newUser.manager,
        batch : (newUser.batch !== "other") ? newUser.batch.toLowerCase() : newUser.customBatch.toLowerCase()
      },{withCredentials:true})
     
      // console.log(res);
      if (res.data.statusCode === 201){
        setLoading(false)
        alertCtx.setToast("success", "User Registered Successfully")
        setNewUser(prev => ({
        ...prev,
        name : "",
        email : "",
        designation : "",
        role : "",
        manager : "",
        batch : "",
        customBatch : "",
        password : "",
      }))
      navigate("/")
  }
    } catch (error) {
      setLoading(false)
      console.log(error);
      alertCtx.setToast("error",extractErrorMessage(error?.response?.data));
    }
    
  }

  useEffect(()=>{
    fetchAdmin();
    fetchBatches();
  },[])

  return (
    <>
    <div className='flex text-start cursor-pointer text-xl items-center font-bold p-2' onClick={()=>{navigate("/")}}><IoIosArrowBack/> Back</div>
    <div className="flex flex-col w-full pt-5 pb-12 items-center justify-center min-h-[80vh] dark:bg-[#191919] dark:text-white">
            <h1 className="text-2xl lg:text-4xl font-bold  pb-2">Add New User</h1>
        <form className=" mx-auto w-11/12 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
        <div className="mb-3">
            <label name="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Name</label>
            <input type="text" autoComplete='off' name="name" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Name" value={newUser.name} onChange={handleNewUserChange} />
        </div>
        <div className="mb-3">
            <label name="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
            <input type="email" autoComplete='off' name="email" placeholder="Enter your email" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 " value={newUser.email} onChange={handleNewUserChange} />
        </div>
        <div className="mb-3">
            <label name="designation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Designation</label>
            <input type="text" autoComplete='off' name="designation" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Designation" value={newUser.designation} onChange={handleNewUserChange} />
        </div>
        <div className="mb-3">
            <label name="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Role</label>
            <select name="role" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500" value={newUser.role} onChange={handleNewUserChange}>
                <option value="">
                  Select Role
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
        </div> 
        <div className="mb-3">
            <label name="manager" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Manager</label>
            <select name="manager" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500" value={newUser.manager} onChange={handleNewUserChange}>
                <option value="">
                  Select Manager
                </option>
                {admins?.map((admin, index)=>(
                  <option key={index} value={admin?._id}>{admin?.name}</option>
                ))}
            </select>
        </div> 
        <div className="mb-3">
            <label name="batch" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Batch</label>
            <select name="batch" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500" value={newUser.batch} onChange={handleNewUserChange}>
                <option value="">
                  Select Batch
                </option>
                <option className='font-semibold' value="other">Add new Batch</option>
                {batches?.map((batch, index)=>(
                  <option key={index} value={batch}>{batch}</option>
                ))}
            </select>
            {newUser.batch === "other" && (
            <div className="mt-3">
              <label
                name="customBatch"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Enter Custom Batch
              </label>
              <input
                type="text"
                name="customBatch"
                className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500"
                placeholder="Enter Custom Batch"
                value={newUser.customBatch || ""}
                onChange={handleNewUserChange}
              />
            </div>
  )}

        </div>
       
        <div className="mb-3">
            <label name="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Password</label>
            <div className="flex rounded-lg ">
            <input type={showpassword ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Password" value={newUser.password} onChange={handleNewUserChange}/>
            <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50 border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }</div>
            </div>
        </div>
       
          <button type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loading ? <Loader size='md' /> : "Register" }
          </button>
        </form>
    
        </div>
        </>
  )
}

export default Register
