import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmpQuestions, extractErrorMessage, Server } from "../constants";
import { useLogin } from "../store/contexts/LoginContextProvider";
import {useAlert} from "../store/contexts/AlertContextProvider"
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import logo from "../assets/logos/logo.png"
import { IoMenu } from "react-icons/io5";
import logo_gold from "../assets/logos/logo_golden.png"
import PeiChart from "../components/PeiChart";
import { useTheme } from "../store/contexts/ThemeContextProvider";

function EmployeeAssessment() {
  const [ showReport, setShowReport] = useState(false);
  const [status, setStatus] = useState("");
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

  const alertCtx = useAlert()
  const {userId } = useParams();
  const loginCtx = useLogin();
  const navigate = useNavigate();
  const themeCtx = useTheme();

  const verify = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${Server}/users/getusers?userId=${userId}`);
        if (res.data.statusCode === 200) {
            const user = (res?.data?.data)[0];
            setUser(user);
            if (String(user?.managerId) === loginCtx?.userId ) {    
              setVerified(true);
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
      const res = await axios.get(`${Server}/assessments/get?userAssessed=${userId}&assessedBy=${loginCtx.userId}`,{withCredentials:true});
      
      if (res.data.statusCode === 200){
        setStatus(res?.data?.data[0]?.status || "");
        
        setAssessmentId(res?.data?.data[0]?._id);
        
        const fetchedScore = res?.data?.data[0]?.score;
        if (fetchedScore) setScore(fetchedScore);
      }
      
    } catch (error) {
      setStatus("");
      console.log(extractErrorMessage(error.response.data))
    }
  }

  //Use it if required
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


  const handleSave = async(status, submit = false) => {
    // console.log(status);
    if (status === "finished" && submit){
      for (let cat in score){
        for (let temp in score[cat]){
          if (score[cat][temp]?.rating === 0){
            return alertCtx.setToast("error","All MCQs are required to be answered before submitting (comments are optional)")
          }
        }
      }
    }
    // console.log(assessmentId);
    
    try {
      if(!assessmentId){
        const res = await axios.post(`${Server}/assessments/add`,{
          userAssessed : userId,
          assessedBy : loginCtx.userId,
          status : status,
          score : score
        },{withCredentials:true});
        // console.log(res);
        
        if (res?.data?.statusCode === 201) {
          setStatus(res?.data?.data?.status)
          return alertCtx.setToast("success","Saved Successfully");
        }
      }

      else{
        const res = await axios.patch(`${Server}/assessments/update`,{
          assessmentId : assessmentId,
          status : status || "finished",
          score : score
        },{withCredentials:true});

        if (res?.data?.statusCode === 200) {
          setStatus(res?.data?.data?.status)
          if (res?.data?.data?.status==="finished" && submit){
            alertCtx.setToast("success" ,"Submitted Successfully");
            navigate("/");
            return;
          }
          return alertCtx.setToast("success","Saved successfully");
        }
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
         <div className='flex cursor-pointer text-2xl items-center dark:text-gray-100 font-bold p-2' onClick={()=>{navigate("/")}}><IoIosArrowBack/> Back</div>
          {
          verified ? 
          <div className="flex flex-col sm:flex-row w-full bg-whitel">

              {/* Toggleable Sidebar */}
              <div className="block  ">
                <button
                title={showSidebar ? "close": "open sidebar" }
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 m-4 text-2xl text-black dark:text-gray-100 rounded-xl"
                >
                  {showSidebar ? <IoMdClose/> : <IoMenu/>  }
                </button>
                {showSidebar && (
                  <div className="fixed top-0 left-0 w-80 h-full bg-gray-100 dark:bg-[#191919] dark:border-r dark:border-gray-300 shadow-lg p-6 z-50">
                    <div className="flex justify-end mb-4">
                      <button
                      title="close"
                        onClick={() => setShowSidebar(false)}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200"
                      >
                        &#10005;
                      </button>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl font-bold mb-6"><img src={themeCtx.theme === "light" ? logo : logo_gold}  alt="" className="w-24" /></div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        <span className="block mb-2">Name: <span className="font-semibold">{user?.name}</span></span>
                        <span className="block mb-2">Designation: <span className="font-semibold">{user?.designation}</span></span>
                      </p>
                      <button onClick={()=>{setShowReport(prev => !prev);setShowSidebar(false)}} className="mt-4 bg-white dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:shadow-[#121212] shadow-lg
                       text-blue-600 rounded-3xl px-4 py-2 hover:shadow-md transition-colors">
                        View {!showReport ? "Report":"Assessment"} 
                      </button>
                      <p className="mt-6 text-lg font-semibold">Total Score: {getTotalScore()}/120</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content */}
             {!showReport ?  <div className="flex-1 py-3 p-6 md:w-3/4">
                <span className="font-bold"> Status : <span className={`text-${status==="finished" ? "green-500" : (status==="in-progress" ? "yellow-300" : "red-500")}`}> {status || "pending"} </span> </span>
                {/* navigation */}
                <ol className="items-center w-full sm:flex sm:space-x-3 sm:space-y-0 rtl:space-x-reverse">
                  {EmpQuestions?.map((category, index) => (
                    <li 
                      key={index} 
                      onClick={() => { setActive(index);
                       }} 
                      className={`flex text-sm items-center cursor-pointer transition-colors duration-300 ${(active === index) ? "text-blue-600 dark:text-blue-600" : "text-gray-800 dark:text-gray-200"} hover:bg-gray-100 dark:hover:bg-[#303030] p-3 rounded-xl`}
                    >
                      <span className={`flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold border-2 ${(active === index) ? "border-blue-600" : "border-gray-400 dark:border-gray-200"}  rounded-full shrink-0`}>
                        {index + 1}
                      </span>
                      <span className="font-bold">{category.category.toUpperCase()}</span>
                      {(index < EmpQuestions.length-1) && (
                        <svg 
                          className={`w-4 h-4 ms-2 sm:ms-4 rtl:rotate-180 ${(active === index) ? "text-blue-600" : "text-gray-800 dark:text-gray-200"}`} 
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
                  {/* Questions */}
                  {EmpQuestions[active]?.subcategories?.map(sub => (
                      <div 
                      key={sub.subcategory} 
                      className="mb-6 border-b border-gray-300 pb-4 last:border-none"
                      >
                      <div className="w-full mb-3">
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-100"> <span className="font-bold"> {sub.SNo}</span> . {sub.question}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        
                        <div className="flex flex-col gap-1 text-lg mt-3 sm:mt-0 md:w-1/2 sm:justify-center"> 
                        {
                            sub.options.map((value, index) => (
                                <div 
                                key={value} 
                                className="flex items-center space-x-2 p-2 border dark:border-gray-400 rounded-md hover:bg-gray-200 dark:bg-transparent transition duration-200"
                                >
                                <input
                                    checked={(index + 1) === score[EmpQuestions[active].category][sub.subcategory]?.rating}
                                    // onChange={()=>{}}
                                    readOnly
                                    name={`${EmpQuestions[active].category}-${sub.subcategory}`}
                                    type="radio"
                                    id={`${EmpQuestions[active].category}-${sub.subcategory}-${index}`}
                                    onClick={() => {
                                        handleRatingChange(EmpQuestions[active].category, sub.subcategory, index + 1);
                                    }}
                                    className="w-4 h-4 accent-blue-600 dark:bg-gray-700"
                                    />
                                <label 
                                    htmlFor={`${EmpQuestions[active].category}-${sub.subcategory}-${index}`} 
                                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                                    >
                                    {value}
                                </label>
                                </div>
                            ))
                            }

                        </div>

                        {/* uncomment if required  along with handleCommentchange function*/}
                        <textarea 
                          placeholder="Comment (optional)"
                          key={sub.SNo + EmpQuestions.length + 1} 
                          className={`w-full h-24 lg:h-16 md:w-1/2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-transparent dark:focus:ring-gray-400 focus:border-transparent cursor-${!verified && "not-allowed"}`}
                          readOnly={!verified}
                          value={score[EmpQuestions[active].category][sub.subcategory].comment} 
                          onChange={(e) => { handleCommentChange(EmpQuestions[active].category, sub.subcategory, e.target.value); }}
                        />

                      </div>
                    </div>
                  ))}

                  {/* Score */}
                  <div className="flex justify-center space-x-4 mt-4 font-bold text-blue-800 dark:text-blue-600">
                    {EmpQuestions[active].category.toLocaleUpperCase()} SCORE : {getScore(EmpQuestions[active].category)}/20
                   </div>

                  {/* Buttons */}
                 {verified && <div className="flex justify-end space-x-4 mt-4">
                    {(active > 0) && (
                      <button 
                        className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors duration-300" 
                        onClick={() => { setActive(prev => prev - 1); }}
                      >
                        Back
                      </button>
                    )}
                    {(active < (EmpQuestions.length - 1)) && (
                      <button 
                        className="bg-blue-500 dark:bg-blue-600 text-white rounded-lg px-4 py-2 dark:hover:bg-blue-700 hover:bg-blue-600 transition-colors duration-300" 
                        onClick={() => { handleSave(status || "in-progress").then(()=>{setActive(prev=>prev+1)}) }}
                      >
                        {verified && "Save and"} Next
                      </button>
                    )}
                    {(active === (EmpQuestions.length - 1)) && (
                      <button 
                        onClick={() => {handleSave(status || "in-progress") }}
                        className="bg-blue-500 dark:bg-blue dark:hover:bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-300" 
                      >
                        Save
                      </button>
                    )}
                    {(active === (EmpQuestions.length - 1)) && (
                      <button 
                        onClick={() => { handleSave("finished", true) }}
                        className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors duration-300" 
                      >
                        Submit
                      </button>
                    )}
                    
                   
                   
                  </div>}
                </div>

              </div>
              :
              <PeiChart score={score}/>
              }
          </div>

          : 
          <div className="flex text-black dark:text-gray-100 w-full min-h-[80vh] justify-center items-center">
            You are not authorized to access this page!
          </div>
        }
        </>
      ) : (
        <>
          <div className="flex text-black dark:text-gray-100 w-full min-h-[95vh] justify-center items-center">
            Verifying User...
          </div>
        </>
      )}
    </>
  );
}

export default EmployeeAssessment;
