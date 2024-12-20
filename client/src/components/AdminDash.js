import React, { useEffect, useState } from 'react'
import {  MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import Loader from "./Loader"
import {useAlert} from "../store/contexts/AlertContextProvider"
import {useLogin} from "../store/contexts/LoginContextProvider"
import {extractErrorMessage, Server} from "../constants"
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import BarGraph from './BarGraph';

function EmployeeReport({batches}) {
    const [active, setActive] = useState("pending");
    const [open, setOpen] = useState([]);
    const [search, setSearch] = useState({});
    const [selected, setSelected] = useState([]);
    const [fetching, setFetching] = useState([])
    const [userData, setUserData] = useState([]);
    
    const alertCtx = useAlert();
    const loginCtx = useLogin();
    const navigate = useNavigate();

    const handleLoader = (key)=>{
        setFetching((prev) => {
            if (prev.includes(key)) {
              return prev.filter(item => item !== key);
            } else {
                return [...prev, key];}
            })
    }

    const openHandler = (key, batch)=>{
        
        setOpen((prev) => {
            if (prev.includes(key)) {
              return prev.filter(item => item !== key);
            } else {
                fetchUserData(key,batch);
                return [...prev, key];}
            })
    }

    const fetchUserData = async(key, batch)=>{
        handleLoader(key);
        try {
            const res = await axios.get(`${Server}/users/getusers?managerId=${loginCtx.userId}&batch=${batch}`);
            if (res?.data?.statusCode === 200){
                const newData = res.data.data;
                // console.log(newData);
                setUserData(prev => [
                    ...prev,
                    ...newData.filter(newItem => !prev.some(prevItem => prevItem._id === newItem._id))
                ]);
            }
            handleLoader(key);
            
        } catch (error) {
            handleLoader(key);
            alertCtx.setToast("error",extractErrorMessage(error?.response?.data));
            // alertCtx.setToast("error","Something went wrong while fetching data")
        }
    }
    
    const getUserStatus = (user)=>{
        if (!user) return "pending";
        if( (user.managerAssessment[0]?.status === "finished") &&  (user.selfAssessment[0]?.status === "finished")){
            return "finished";
        }
        return "pending";
    }
    
    const getCount = (batch) => {
        let sum=0;
        userData.forEach((user)=>{
            if((user.batch === batch) && (getUserStatus(user)===active)) sum+=1;
        })
        return sum;
    }

    const searchHandler = (e, batch) =>{
        setSearch((prevState) => ({
            ...prevState,
             [batch]:e.target.value
            })
          );      
    }

    const filterUsers = (user,query)=>{
        const lowerCaseQuery = query?.toLowerCase() || "";
        return (
            user.name.toLowerCase().includes(lowerCaseQuery) ||
            user.designation.toLowerCase().includes(lowerCaseQuery)
        );
    }

    const handleSelection = (userId)=>{
        setSelected((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId) 
                : [...prevSelected, userId]
        );
    }

    useEffect(()=>{
        for(let batch in batches){
            search[batches[batch]] = ""
        }
        // console.log(userData);
        
    },[userData])

    const getColour = (assessment) => {
        if (assessment[0]?.status === "finished") return "green-500";
        if (assessment[0]?.status === "in-progress") return "yellow-300";
        else return "red-500"
    }

  return (
    <div className='w-full flex flex-col items-center'>

        <div className="flex rounded-md shadow-md w-full text-md font-medium text-center my-1 dark:shadow-[#101010]"> 
                <button onClick={()=>{setActive("pending");setOpen([]);setSelected([])}} className={`${active==="pending" ? "bg-orange-500 dark:bg-orange-500 text-white dark:hover:bg-orange-600 hover:bg-orange-500" : "bg-gray-100 hover:bg-gray-200 dark:text-grary-200 dark:bg-[#292929] dark:hover:bg-[#232323] dark:text-gray-200"} flex items-center justify-center  w-1/2 px-4 py-2 text-black  rounded-l-md transition-all ease-in `} >Pending <span className='ms-1 hidden md:block'> Assessments </span></button>
                <button onClick={()=>{setActive("finished");setOpen([]);setSelected([])}} className={`${active==="finished" ? "bg-[#118B50] text-white hover:bg-[#118B50]" : "bg-gray-100 hover:bg-gray-200 dark:text-grary-200 dark:bg-[#292929] dark:hover:bg-[#232323] dark:text-gray-200"} flex items-center justify-center  w-1/2 px-4 py-2 text-black  rounded-r-md transition-all ease-in `}>Finished <span className='ms-1 hidden md:block'> Assessments </span> </button>
        </div>

        <div className='w-full '>
            
            {batches.map((batch, key)=>(
                <div key={key}> 
                    <button onClick={()=>{openHandler(key, batch)}} id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className={`w-full my-1 focus:outline-none border border-gray-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center justify-between shadow-md  `} type="button">
                    <span className={`font-semibold text-md text-${active==="pending" ? "orange-500" : "green-500"}`}>Batch : {batch.toUpperCase()} | Status : {active} </span>
                    <span className=''> {(open.includes(key)) ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>} </span>
                    </button>

                    <div id="dropdownDivider" className={`w-full ${(open.includes(key)) ?"block" : "hidden"} bg-white divide-y divide-gray-100 shadow rounded-b-md mb-2 dark:bg-gray-700 dark:divide-gray-600`}>
                        {/* table */}
                            {!fetching.includes(key) ? 
                            <>
                                {(getCount(batch)) ?
                                    <div className="relative overflow-x-auto shadow-md dark:bg-[#202020] px-2">
                                    <div className="pb-2 bg-white dark:bg-[#202020]">
                                    
                                        <div className="relative ">
                                            <div className="absolute inset-y-0 rtl:inset-r-0 start-2 flex items-center ps-3 pointer-events-none">
                                                <IoIosSearch/>
                                            </div>
                                            <input type="text" id={"table-search"+batch} onChange={(e)=>{searchHandler(e, batch)}} className="block m-2 pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-58 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#333333] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-300 dark:focus:border-gray-300" placeholder="Search for users"/>
                                        </div>
                                    </div>

                                    <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400 dark:border dark:border-gray-300 mb-2">
                                        <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-[#202020] dark:text-gray-200 dark:border-b dark:border-b-gray-300">
                                            <tr>
                                                {/* <th scope="col" className="p-4">
                                                    <div className="flex items-center">
                                                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                                    </div>
                                                </th> */}
                                                <th scope="col" className="px-6 py-3 font-semibold text-md">
                                                    
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-md">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-md">
                                                    Designation
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-md">
                                                    Status (Self)
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-md">
                                                    Status (Manager)
                                                </th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-md">
                                                    Action
                                                </th>
                                                {/* <th scope="col" className="px-4 py-3 font-semibold text-md">
                                                    See Report 
                                                </th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {userData.map((user,index) => ((user?.batch === batch) && (filterUsers(user, search[batch] || "" )) && (getUserStatus(user)===active) && <tr key={index} className="bg-white text-sm dark:bg-[#292929] hover:bg-gray-50 dark:hover:bg-[#292929]">
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input id="checkbox-table-search-1" onClick={()=>{handleSelection(user._id)}} type="checkbox" defaultChecked={selected.includes(user._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-gray-300 
                                                        dark:text-teal-500 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-300"/>
                                                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                                    </div>
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {user?.name}
                                                </th>
                                                <td className="px-6 py-4 dark:text-gray-100">
                                                    {user?.designation}
                                                </td>
                                                <td onClick={()=>{navigate(`/self-assessment/${user?._id}`)}} className={`underline cursor-pointer px-6 py-4 text-${getColour(user?.selfAssessment)}`}>
                                                    {user?.selfAssessment[0]?.status || "pending"}
                                                </td>
                                                <td onClick={()=>{navigate(`/emp-assessment/${user?._id}`)}} className={`underline cursor-pointer px-6 py-4 text-${getColour(user?.managerAssessment)}`}>
                                                    {user?.managerAssessment[0]?.status || "pending"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link to={`/report/${user._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">See Report</Link>
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">See</a>
                                                </td> */}
                                            </tr>))}
                                        </tbody>
                                    </table>

                                    </div>:
                                <div className='py-4 text-center rounded-b-md dark:bg-[#252525] '>
                                    No results
                                </div>
                                }
                            </>
                            :
                            <div className='flex w-full min-h-36 justify-center items-center dark:bg-[#202020]'>
                                {fetching.includes(key) && <Loader color={active==="pending" ? "warning" :'success'} size='lg'/>}
                            </div>
                            }

                    </div>
                </div>
            ))}

            <div className='w-full py-2'>
                <BarGraph users={userData.filter((user) => selected.includes(user?._id))} title="selfAssessment" />
            </div>
            <div className='w-full py-2'>
                <BarGraph users={userData.filter((user) => selected.includes(user?._id))} title="managerAssessment" />
            </div>

        </div>
      
    </div>
  )
}

export default EmployeeReport
