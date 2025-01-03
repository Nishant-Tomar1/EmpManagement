import React, { useEffect, useState } from "react";
import { Route, useNavigate, Routes, useLocation } from "react-router-dom"
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
import EmployeeAssessment from "./pages/EmployeeAssessment.js";
import AssessmentReport from "./pages/AssessmentReport.js";
import CreatePassword from "./pages/CreatePassword.js";

function App() {
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies()
  const navigate = useNavigate();
  const loginCtx = useLogin();
  const location = useLocation();

  const verifyToken = async () => {
    
    if ((!cookie.token) && (location.pathname.split("/")[1] != "create-password")) {
      setLoading(false);
      navigate("/auth");
      return;
    }
    try {
      const res = await axios.get(`${Server}/users/verify-token`,{
        withCredentials:true
      })
      if (res.status ===200){
        const user = res?.data?.data;
        loginCtx.login(user?._id, user?.name,user?.role, user?.token );
        setLoading(false);
      }
      
    } catch (error) {
      setLoading(false);
      // console.log(error);
      console.log(extractErrorMessage(error?.response?.data)); 
      if ((location.pathname.split("/")[1] != "create-password")){
        navigate("/auth") 
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    verifyToken();
  },[])
  

  return (
    <>
    {!loading ? 
      <Routes path="/" element={<Layout/>}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/register" element={<Auth/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/self-assessment/:userId" element={<SelfAssessment/>}/>
          <Route path="/emp-assessment/:userId" element={<EmployeeAssessment/>}/>
          <Route path="/report/:userId" element={<AssessmentReport/>}/>
          <Route path="/change-password" element={<ChangePassword/>} />
          <Route path="/create-password/:userId" element={<CreatePassword/>} />
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
