import React from 'react'
import Login from '../components/Login'
import { useLocation,  } from 'react-router-dom'
import Register from '../components/Register'
import { useLogin } from '../store/contexts/LoginContextProvider'

function Auth() {
  const location = useLocation()
  const loginCtx = useLogin();
  
  return (
    <div>
      
      {((location.pathname === "/register") && (loginCtx.role === "admin"))
      ?
      <Register/>:
      <Login/>}
    </div>
  )
}

export default Auth
