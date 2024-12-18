import React from 'react'
import logo from "../assets/logos/logo.png"

function NotFound() {
  return (
    <div className='flex flex-col w-full min-h-[80vh] items-center justify-center'>
      <img src={logo} className='w-24' alt="" />
      <span className='text-3xl mt-4 font-bold text-red-500'>404 - Not Found</span>
    </div>
  )
}

export default NotFound
