import React from 'react'
// import { Outlet } from 'react-router-dom'
import Toast from '../components/Toast.js'
import { useTheme } from '../store/contexts/ThemeContextProvider.js'
import Navbar from '../components/Navbar.js';

function Layout({children}) {
  const {theme} = useTheme();
  return (
    <>
      <div className={`${theme}`}>
        <Toast/>
          <Navbar/>
        <div className=' w-full'>
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
