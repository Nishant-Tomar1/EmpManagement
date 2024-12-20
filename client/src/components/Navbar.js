import { useLogin } from "../store/contexts/LoginContextProvider";
import {useAlert} from "../store/contexts/AlertContextProvider"
import { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import {  MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import axios from 'axios'
import {extractErrorMessage, Server} from "../constants"
import logo from "../assets/logos/logo.png"
import logo_gold from "../assets/logos/logo_golden.png"
import { FaUserLarge } from "react-icons/fa6";
import { LuSun } from "react-icons/lu";
import { PiMoonStarsFill } from "react-icons/pi";
import {useTheme} from "../store/contexts/ThemeContextProvider"

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const themeCtx = useTheme();
    const loginCtx = useLogin();
    const alertCtx = useAlert();
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const handlelogout = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${Server}/users/logout`,{},{withCredentials:true});
            if (res?.status === 200){
              loginCtx.logout();
              setLoading(false);
              alertCtx.setToast("success","Logged Out Successfully.")
              navigate("/auth");
            }
        } catch (error) {
            setLoading(false);
            navigate("/auth")
            alertCtx.setToast("error",extractErrorMessage(error?.response?.data))
            setLoading(false);
        }
    }
    

  return (
    <>
    { !(["/auth","/forgotpassword"].includes(pathname))&&(loginCtx.isLoggedIn)&&
    <div className="shadow-lg dark:shadow-lg dark:shadow-[#090909] flex sticky top-0 bg-white dark:bg-[#151515] dark:text-gray-100 justify-between px-4 p-2 items-center  z-[20]">
      <div onClick={()=>{navigate("/")}} className="cursor-pointer flex items-center">
        
        <img src={themeCtx.theme === "light" ? logo : logo_gold} alt="" className="w-4 h-6" />
        <span className="flex mx-4 text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-200"> 
          <span className="hidden md:block font-bold">
            Employee Assessment
          </span>
        </span>
      </div>
      <div>
      <div className="flex gap-5">
        <button title="Toggle theme" onClick={()=>{themeCtx.toggleTheme()}} className="text-2xl p-1 lg:px-4 hover:scale-105 rounded-full"> {themeCtx.theme === "light" ? <LuSun/> : <PiMoonStarsFill/>}</button>
        <div className="flex flex-col justify-center items-center">
            <button onClick={()=>{setOpen(prev=>!prev)}} id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className="flex justify-center items-center mt-1 text-black focus:outline-none border-1 bg-gray-200 hover:bg-gray-300 border-gray-400 dark:bg-[#151515] dark:hover:bg-[#252525] dark:text-gray-300 dark:border-gray-200 dark:border  font-semibold rounded-lg text-sm px-5 py-2.5 text-center gap-2 mb-2" type="button"><span><FaUserLarge/></span>{loginCtx.name}
              {open ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
            </button>
            <div id="dropdownDivider" className={`z-10 ${open ?"block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-[#232323] dark:divide-gray-600 fixed top-14`}>
                <ul onClick={()=>{setOpen(false)}} className="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                  <li>
                    <Link to="/" className="block px-4 py-2 hover:bg-gray-100 rounded-t-md dark:hover:bg-[#333333] dark:hover:text-white">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#333333] dark:hover:text-white">Change Password</Link>
                  </li>
                  {(loginCtx.role === "admin") && <li>
                    <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#333333] dark:hover:text-white">Add new User</Link>
                  </li>}
                  {(loginCtx.role==="user")&&<li>
                    <Link to={`/self-assessment/${loginCtx.userId}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#333333] dark:hover:text-white">Self-assessment </Link>
                  </li>}
                </ul>
                <div className="py-2 bg-red-600 rounded-b-md hover:bg-red-700">
                  <button onClick={()=>{alertCtx.showConfirm("Do you really want to logout of your account?",handlelogout);setOpen(false);}} className="block px-4 text-md w-full font-semibold text-white ">{!loading ? "Sign Out" : "Loading.."}</button>
                </div>
            </div>
        </div>
        </div>
      </div>

    </div>}
    </>
  );
}
