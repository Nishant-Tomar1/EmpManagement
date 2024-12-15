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
    <div>
      <form action="" onSubmit={handleSumbit}>
        <input type="text" value={user.email} name='email' onChange={handleUserChange}/> <br />
        <input type="text" value={user.password} name='password' onChange={handleUserChange}/>
        <button type='submit'>{loading?"loading...":"Login"} </button>
      </form>
        <Link to="/forgotpassword">Forgot Password?</Link>
    </div>
  )
}

export default Login
