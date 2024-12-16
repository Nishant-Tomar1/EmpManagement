import React from 'react'
import { useLogin } from '../store/contexts/LoginContextProvider'
import { Link } from 'react-router-dom';

function Dashboard() {
    const loginCtx = useLogin();

    return (
        <div>
            {
                loginCtx.role === "admin" ?
                <>
                    <h1 className="text-3xl font-bold underline">
                        Admin Dashboard <br />
                        {`Welcome : ${loginCtx.name}, You are ${loginCtx.role}`}
                    </h1>
                </>
                :
                <>
                    <Link to={`/self-assessment/${loginCtx.userId}`}>Click here to do self Assessment</Link>
                </>
            }
        
        </div>
    )
}

export default Dashboard
