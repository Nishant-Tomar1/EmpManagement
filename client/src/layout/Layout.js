import React from 'react'
// import { Outlet } from 'react-router-dom'
import Toast from '../components/Toast.js'
import { useTheme } from '../store/contexts/ThemeContextProvider.js'

function Layout({children}) {
  const {theme} = useTheme();
  return (
    <>
      <div className={`${theme}`}>
        <Toast/>
        <div className=' min-h-[100vh] w-full'>
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
