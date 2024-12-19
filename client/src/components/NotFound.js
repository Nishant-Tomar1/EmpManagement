import React from 'react'
import logo from "../assets/logos/logo.png"
import logo_gold from "../assets/logos/logo_golden.png"
import { useTheme } from '../store/contexts/ThemeContextProvider'

function NotFound() {
  const themeCtx = useTheme()
  return (
    <div className='flex flex-col w-full min-h-[80vh] items-center justify-center'>
      <img src={themeCtx.theme === "light" ? logo : logo_gold} className='w-24' alt="" />
      <span className='text-3xl mt-4 font-bold text-red-500'>404 - Not Found</span>
    </div>
  )
}

export default NotFound
