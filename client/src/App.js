import React, { useEffect, useState } from "react";
import { Route, useNavigate, Routes } from "react-router-dom"
import Layout from "./layout/Layout.js";
import HomePage from "./pages/HomePage.js";
import Auth from "./pages/Auth.js";
import { useCookies } from "react-cookie";
import NotFound from "./components/NotFound.js";
import axios from "axios";
import { extractErrorMessage, Server } from "./constants.js";
import { useLogin } from "./store/contexts/LoginContextProvider.js";
import Loader from "./components/Loader.js";
import ForgotPassword from "./components/ForgotPassword.js";
import SelfAssessment from "./pages/SelfAssessment.js";
import ChangePassword from "./pages/ChangePassword.js";

function App() {
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies()
  const navigate = useNavigate();
  const loginCtx = useLogin();

  const verifyToken = async () => {
    if (!cookie.token) {
      setLoading(false);
      navigate("/auth");
      return;
    }
    try {
      const res = await axios.get(`${Server}/users/verify-token`,{
        withCredentials:true
      })
      if (res.status ===200){
        console.log("verified");
        const user = res?.data?.data;
        loginCtx.login(user?._id, user?.name,user?.role, user?.token );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(extractErrorMessage(error?.response?.data)); 
      navigate("/auth") 
    }
  }

  useEffect(() => {
    setLoading(true);
    console.log("page rendered");
    verifyToken();
  },[])
  

  return (
    <>
    {!loading ? 
      <Routes path="/" element={<Layout/>}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/self-assessment/:userId" element={<SelfAssessment/>}/>
          <Route path="/change-password" element={<ChangePassword/>} />
          <Route path="*" element={<NotFound/>}/>
      </Routes>
      :
      <div className="flex text-black w-full min-h-[95vh] justify-center items-center">
        <Loader/>
      </div>
    }
    </>
  );
}

export default App;
