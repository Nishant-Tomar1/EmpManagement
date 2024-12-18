import { useLogin } from "../store/contexts/LoginContextProvider";
import {useAlert} from "../store/contexts/AlertContextProvider"
import { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import {  MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import axios from 'axios'
import {extractErrorMessage, Server} from "../constants"
import logo from "../assets/logos/logo.png"
import { FaUserLarge } from "react-icons/fa6";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
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
    { !(["/auth","/forgotpassword"].includes(pathname))&&
    <div className="shadow-lg flex sticky top-0 bg-white justify-between px-4 p-2 items-center border bottom-2">
      <div onClick={()=>{navigate("/")}} className="cursor-pointer flex items-center">
        
        <img src={logo} alt="" className="w-4 h-6" />
        <span className="flex mx-4 text-xl sm:text-2xl font-bold text-gray-700"> 
          {/* <span className="text-2xl mx-1 font-bold hidden sm:block"> {(loginCtx.role)?.replace(/^./, char => char.toUpperCase())} </span>  */}
          <span className="hidden sm:block font-bold">
            Employee Assessment
          </span>
        </span>
      </div>
      <div>
        <button onClick={()=>{setOpen(prev=>!prev)}} id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider" className="mt-1 text-black focus:outline-none border-1 bg-gray-200 hover:bg-gray-300 border-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 mb-2" type="button"><span><FaUserLarge/></span>{loginCtx.name}
          {open ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
        </button>
        <div id="dropdownDivider" className={`z-10 ${open ?"block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 z-10 fixed right-4`}>
            <ul onClick={()=>{setOpen(false)}} className="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
              <li>
                <Link to="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Change Password</Link>
              </li>
              <li>
                <Link to={loginCtx.role === "user" ? `/self-assessment/${loginCtx.userId}` : "/emp-self"} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{loginCtx.role === "user" ? `Self-assessment` : "Employee Self-Assessment"}</Link>
              </li>
            </ul>
            <div className="py-2 hover:bg-gray-100">
              <button onClick={()=>{alertCtx.showConfirm("Do you really want to logout of your account?",handlelogout);setOpen(false);}} className="block px-4 text-sm w-full text-red-500 ">{!loading ? "Sign Out" : "Loading.."}</button>
            </div>
        </div>
      </div>

    </div>}
    </>
  );
}
