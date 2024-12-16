import { Dropdown } from "flowbite-react";
import { useLogin } from "../store/contexts/LoginContextProvider";
import {useAlert} from "../store/contexts/AlertContextProvider"
import { useState } from "react";
import Loader from "./Loader"
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios'
import {extractErrorMessage, Server} from "../constants"

export default function User() {
    const[loading, setLoading] = useState(false);
    const loginCtx = useLogin();
    const alertCtx = useAlert();
    const navigate = useNavigate();

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
            alertCtx.setToast("error",extractErrorMessage(error?.response?.data))
            setLoading(false);
        }
    }

  return (
    <Dropdown label={loginCtx.name || "User"} dismissOnClick={false}>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Link to="/change-password"> <Dropdown.Item>Change Password</Dropdown.Item> </Link>
      <Link to={`/self-assessment/${loginCtx.userId}`}> <Dropdown.Item>Self Assessment</Dropdown.Item> </Link>
      <Dropdown.Divider/>
      {!loading ? <div onClick={()=>{alertCtx.showConfirm("Do you really want to Logout ?",handlelogout)}}> <Dropdown.Item className="text-red-500" >Sign Out</Dropdown.Item> </div> : <Loader size="md" color="failure"/>}
    </Dropdown>
  );
}
