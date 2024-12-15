import React from 'react'
import { useLogin } from '../store/contexts/LoginContextProvider'
import User from '../components/User'

function HomePage() {
  const loginCtx = useLogin()

  return (
    <div>
      <User/>
      <h1 className="text-3xl font-bold underline">
        {loginCtx.isLoggedIn ?`Welcome : ${loginCtx.name}, You are ${loginCtx.role}`: "Not Logged In"}
      </h1>

    </div>
  )
}

export default HomePage
