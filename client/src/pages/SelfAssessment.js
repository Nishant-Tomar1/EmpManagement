import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { extractErrorMessage, selfQuestions, Server } from "../constants";
import { useLogin } from "../store/contexts/LoginContextProvider";
import {useAlert} from "../store/contexts/AlertContextProvider"
import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import logo from "../assets/logos/logo.png"
import { IoMenu } from "react-icons/io5";

function SelfAssessment() {
  const [ showReport, setShowReport] = useState(false);
  const [status, setStatus] = useState("in-progress");
  const [user, setUser] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [active, setActive] = useState(0);
  const [score, setScore ] = useState(
          {
            agility: {
                change: {
                    rating: 0,
                    comment: ""
                },
                solving: {
                    rating: 0,
                    comment: ""
                },
                flexibility: {
                    rating: 0,
                    comment : ""
                },
                influence: {
                    rating: 0,
                    comment: ""
                }
            },
            reliability: {
                consistency: {
                    rating: 0,
                    comment: ""
                },
                accountability: {
                    rating: 0,
                    comment: ""
                },
                trust: {
                    rating: 0,
                    comment: ""
                },
                punctuality: {
                    rating: 0,
                    comment: ""
                }
            },
            risk: {
                calculation: {
                    rating: 0,
                    comment: ""
                },
                assessment: {
                    rating: 0,
                    comment: ""
                },
                identification: {
                    rating: 0,
                    comment: ""
                },
                plans: {
                    rating: 0,
                    comment: ""
                }
            },
            decision: {
                analysis: {
                    rating: 0,
                    comment: ""
                },
                decision: {
                    rating: 0,
                    comment: ""
                },
                consequence: {
                    rating: 0,
                    comment: ""
                },
                timeline: {
                    rating: 0,
                    comment: ""
                }
            },
            vision: {
                creation: {
                    rating: 0,
                    comment: ""
                },
                inspiration: {
                    rating: 0,
                    comment: ""
                },
                adaption: {
                    rating: 0,
                    comment: ""
                },
                spread: {
                    rating: 0,
                    comment: ""
                }
            },
            connect: {
                empathy: {
                    rating: 0,
                    comment: ""
                },
                relationship: {
                    rating: 0,
                    comment: ""
                },
                teamwork: {
                    rating: 0,
                    comment: ""
                },
                communication: {
                    rating: 0,
                    comment: ""
                }
            }
          }
        );
  const [loading, setLoading] = useState(false);
  const [verified, setVerified ] = useState(false);
  const [editAccess, setEditAccess] = useState(false);

  const alertCtx = useAlert()
  const {userId } = useParams();
  const loginCtx = useLogin();
  const navigate = useNavigate();

  const verify = async () => {
    console.log("verifying");
    setLoading(true);
    try {
        const res = await axios.get(`${Server}/users/getusers?userId=${userId}`);
        if (res.data.statusCode === 200) {
            const user = (res?.data?.data)[0];
            setUser(user);
            if (user?.managerId === loginCtx?.userId){
              setVerified(true);
            }
            else if (user?._id === loginCtx?.userId ) {
              setVerified(true);
              setEditAccess(true);
            }
        }
    setLoading(false);
    return;
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const fetchdata = async () => {
    try {
      const res = await axios.get(`${Server}/assessments/get?userAssessed=${userId}&assessedBy=${userId}`,{withCredentials:true});
      
      if (res.data.statusCode === 200){
        if (res?.data?.data[0]?.status === "finished"){
            setStatus(res?.data?.data[0]?.status);
            setEditAccess(false);
        }
        setAssessmentId(res?.data?.data[0]?._id);
        const fetchedScore = res?.data?.data[0]?.score;
        if (fetchedScore) setScore(fetchedScore);
      }
      
    } catch (error) {
      console.log(extractErrorMessage(error.response.data))
    }
  }

  const handleCommentChange = (category, subcategory, value)=>{ 
    setScore(prev => ({
      ...prev,
      [category]: {
          ...prev[category],
          [subcategory]: {
              ...prev[category][subcategory],
              comment: value 
          }
      }
  }));  
  }

  const handleRatingChange = (category, subcategory, value)=>{    
    setScore(prev => ({
      ...prev,
      [category]: {
          ...prev[category],
          [subcategory]: {
              ...prev[category][subcategory],
              rating: value 
          }
      }
  }));  
  }

  const handleSave = async(status) => {
    try {
      if(!assessmentId){
        const res = await axios.post(`${Server}/assessments/add`,{
          userAssessed : userId,
          assessedBy : loginCtx.userId,
          status : status,
          score : score
        },{withCredentials:true});
        // console.log(res);
        if (res?.data?.statusCode === 200) return alertCtx.setToast("success",(status === "finished") ? "Submitted Successfully":"Saved Successfully")
      }
      else{
        const res = await axios.patch(`${Server}/assessments/update`,{
          assessmentId : assessmentId,
          status : status || "finished",
          score : score
        },{withCredentials:true});
        // console.log(res);
      if (res?.data?.statusCode === 200) return alertCtx.setToast("success",(status === "finished") ? "Submitted Successfully":"Saved Successfully")
      }
      
    } catch (error) {
      console.log(error);
      
      alertCtx.setToast("error","Something went wrong while saving the data.")
    }
  }

  const getScore = (category)=>{
    let sum = 0;
    for (let data in score[category]){
      sum += score[category][data]?.rating || 0;
    }
    return sum;
  }

  const getTotalScore = ()=>{
    let sum =0;
    for (let category in score){
      sum+=getScore(category);
    }
    return sum
  }

  useEffect(() => {
    verify()
    if (verified){
      fetchdata()
    }
  }, [verified]);

  return (
    <>
      {!loading ? (
        <>
          <div className="cursor-pointer text-3xl p-2" title="back" onClick={() => {navigate("/");}}><IoMdArrowRoundBack /></div>
          {verified ? 
 
          <div className="flex flex-col sm:flex-row w-ful bg-whitel">
              {/* Sidebar */}
              {/* <div className="hidden md:block w-1/4 min-h-screen p-6 shadow-md">
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl font-bold text-gray-600 mb-6"><img src={logo} alt="" className="w-24" /></div>
                  <p className="font-medium text-gray-800">
                    <span className="block mb-2">Name: <span className="font-semibold">Gautam Sawhney</span></span>
                    <span className="block mb-2">Designation: <span className="font-semibold">Head - CRM</span></span>
                  </p>
                  <button className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors">
                    View Report
                  </button>
                  <p className="mt-6 text-lg font-semibold text-gray-700">Total Score: 120/120</p>
                </div>
              </div> */}

              {/* Toggleable Sidebar for Small Devices */}
              <div className="block  ">
                <button
                title={showSidebar ? "close": "open sidebar" }
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 m-4 text-2xl text-black rounded-xl"
                >
                  {showSidebar ? <IoMdClose/> : <IoMenu/>  }
                </button>
                {showSidebar && (
                  <div className="fixed top-0 left-0 w-80 h-full bg-gray-100 shadow-lg p-6 z-50">
                    <div className="flex justify-end mb-4">
                      <button
                      title="close"
                        onClick={() => setShowSidebar(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        &#10005;
                      </button>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl font-bold text-gray-600 mb-6"><img src={logo} alt="" className="w-24" /></div>
                      <p className="font-medium text-gray-800">
                        <span className="block mb-2">Name: <span className="font-semibold">{user?.name}</span></span>
                        <span className="block mb-2">Designation: <span className="font-semibold">{user?.designation}</span></span>
                      </p>
                      <button onClick={()=>{setShowReport(prev => !prev);setShowSidebar(false)}} className="mt-4 bg-white  text-blue-600 rounded-3xl px-4 py-2 hover:bg-gray-200 transition-colors">
                        View {!showReport ? "Report":"Assessment"} 
                      </button>
                      <p className="mt-6 text-lg font-semibold text-gray-700">Total Score: {getTotalScore()}/120</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content */}
             {!showReport ?  <div className="flex-1 p-6 md:w-3/4">
                <span className="text-red-500"> {status === "finished" && "Note : You cannot edit this document now"} </span>
                <ol className="items-center w-full md:px-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse">
                  {selfQuestions?.map((category, index) => (
                    <li 
                      key={index} 
                      onClick={() => { setActive(index); }} 
                      className={`flex items-center cursor-pointer transition-colors duration-300 ${(active === index) ? "text-blue-600" : "text-gray-800"} hover:bg-gray-100 p-3 rounded-xl`}
                    >
                      <span className={`flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold border 500 ${(active === index) ? "border-blue-600" : "border-gray-400"}  rounded-full shrink-0`}>
                        {index + 1}
                      </span>
                      <span className="font-medium">{category.category.toUpperCase()}</span>
                      {index < 5 && (
                        <svg 
                          className={`w-4 h-4 ms-2 sm:ms-4 rtl:rotate-180 ${(active === index) ? "text-blue-600" : "text-gray-800"}`} 
                          aria-hidden="true" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 12 10"
                        >
                          <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="m7 9 4-4-4-4M1 9l4-4-4-4" 
                          />
                        </svg>
                      )}
                    </li>
                  ))}
                </ol>

                <div className="mt-6"> 
                  {selfQuestions[active]?.subcategories?.map(sub => (
                    <div 
                      key={sub.subcategory} 
                      className="mb-6 border-b border-gray-300 pb-4 last:border-none"
                    >
                      <div className="w-full mb-3">
                        <p className="text-lg font-semibold text-gray-700"> <span className="font-bold"> {sub.SNo}</span> . {sub.question}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <textarea 
                          key={sub.SNo + selfQuestions.length + 1} 
                          className={`w-full h-24 lg:h-16 md:w-2/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-${!editAccess && "not-allowed"}`}
                          readOnly={!editAccess}
                          value={score[selfQuestions[active].category][sub.subcategory].comment} 
                          onChange={(e) => { handleCommentChange(selfQuestions[active].category, sub.subcategory, e.target.value); }}
                        />
                        <div className="flex gap-1 text-lg mt-3 sm:mt-0 md:w-1/3 sm:justify-center"> 
                        Score : 
                          {
                            [1, 2, 3, 4, 5].map((value) => (
                              <span 
                                className={`cursor-${editAccess ? "pointer" : "not-allowed"} text-yellow-400 text-xl`}
                                key={value} 
                                onClick={() => { if(editAccess){handleRatingChange(selfQuestions[active].category, sub.subcategory, value)}; }}
                              >
                                {(value <= score[selfQuestions[active].category][sub.subcategory].rating) ? <RiStarFill /> : <RiStarLine />}
                              </span>
                            ))
                          }
                          <button onClick={() => { if(editAccess){handleRatingChange(selfQuestions[active].category, sub.subcategory, 0)};}} className="underline text-sm"> clear</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center space-x-4 mt-4 font-semibold">
                    {selfQuestions[active].category.toLocaleUpperCase()} SCORE : {getScore(selfQuestions[active].category)}/20
                   </div>

                 {editAccess && <div className="flex justify-end space-x-4 mt-4">

                   
                    {(active > 0) && (
                      <button 
                        className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors duration-300" 
                        onClick={() => { setActive(prev => prev - 1); }}
                      >
                        Back
                      </button>
                    )}
                    {(active < (selfQuestions.length - 1)) && (
                      <button 
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300" 
                        onClick={() => { handleSave("in-progress").then(()=>{setActive(prev => prev + 1);}) }}
                      >
                        {editAccess && "Save and"} Next
                      </button>
                    )}
                    {(active === (selfQuestions.length - 1)) && (
                      <button 
                        onClick={() => {handleSave("in-progress") }}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300" 
                      >
                        Save
                      </button>
                    )}
                    {(active === (selfQuestions.length - 1)) && (
                      <button 
                        onClick={() => {alertCtx.showConfirm("Are you sure to submit? You will not be able tomake changes after submitting.", handleSave) }}
                        className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors duration-300" 
                      >
                        Submit
                      </button>
                    )}
                    
                   
                   
                  </div>}
                </div>
              </div>
              :
              <div className="flex-1 p-6 md:w-3/4">report</div>
              }
          </div>

          : 
          <div className="flex text-black w-full min-h-[80vh] justify-center items-center">
            You are not authorized to access this page!
          </div>
        }
        </>
      ) : (
        <>
          <div className="flex text-black w-full min-h-[95vh] justify-center items-center">
            Verifying User...
          </div>
        </>
      )}
    </>
  );
}

export default SelfAssessment;