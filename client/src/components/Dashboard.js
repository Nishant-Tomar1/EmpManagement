import React, { useEffect, useState } from 'react'
import { useLogin } from '../store/contexts/LoginContextProvider'
import { Link } from 'react-router-dom';
import axios from "axios"
import {extractErrorMessage, Server} from "../constants"
import AdminDash from './AdminDash';

function Dashboard() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const loginCtx = useLogin();

    const fetchBatches =  async()=>{
        try {
            const res = await axios.get(`${Server}/users/get-batches`, {withCredentials :true});
            if (res?.data?.statusCode === 200){
                setBatches(res.data?.data?.batches);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log(extractErrorMessage(error?.response?.data));
        }
    }

    useEffect(()=>{
        if (loginCtx.role === "admin"){
            setLoading(true);
            fetchBatches();
        }
    },[loginCtx.role])

    return (
        <div className='flex items-center justify-center py-4 '>
            
                <div className='flex flex-col w-full items-center p-2'>
                    <h1 className="text-2xl text-center md:text-3xl font-bold">
                        {`Welcome, ${loginCtx.name}`}
                    </h1>
                    {
                loginCtx.role === "admin"  ?
                    <div className='flex items-center justify-center my-4 md:my-6 text-center w-full xl:w-4/5 2xl:w-3/4'>
                        {loading ? "Fetching Employee data..." :
                            <AdminDash batches={batches}/>
                        }
                     </div>
                     :    
                    <Link className='p-3 underline text-cyan-500 dark:text-cyan-400' to={`/self-assessment/${loginCtx.userId}`}>Click here to do self Assessment</Link>
                    }
                </div>
                
                
            
        
        </div>
    )
}

export default Dashboard
