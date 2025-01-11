import React, { useEffect, useState , useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {useAlert} from "../store/contexts/AlertContextProvider"
import { useLogin } from '../store/contexts/LoginContextProvider';
import {extractErrorMessage, selfQuestions, Server} from '../constants'
import logoPath from '../assets/logos/logo.png';
import axios from 'axios'
import { IoIosArrowBack } from 'react-icons/io';
import BarGraph from '../components/BarGraph';
import html2canvas from 'html2canvas'


function AssessmentReport() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const {userId} = useParams()
  const alertCtx = useAlert()
  const loginCtx = useLogin()
  const navigate = useNavigate()

  const getScore = (category, score)=>{
    let sum = 0;
    for (let data in score[category]){
      sum += score[category][data]?.rating || 0;
    }
    return sum;
  }

  const getAverageScore = (score)=>{
    let sum =0;
    let cnt=0;
    for (let category in score){
      cnt++;
      sum+=getScore(category,score);
    }
    return sum/cnt;
  }

  const getRank = (score) => {
    if (!score) return ["Novice","gray-400"]
    let sum = 0;
    let count = 0;
    for (let category in score){
      sum+=getScore(category, score);
      count+=1;;
    }
    const rank = sum/(count || 1);
    
    if(rank<=4) return ["Novice","gray-400"];
    if(rank<=8) return ["Boomer","orange-500"];
    if(rank<=13) return ["Compliant","green-500"];
    if(rank<=17) return ["Star","blue-500"];
    return ["Role Model","yellow-300"];  
  }

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Server}/users/getusers?userId=${userId}`,{withCredentials:true});
      if (res.data.statusCode === 200){
        setUser(res.data.data[0]);
        // console.log(res.data.data[0]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertCtx.setToast("error", extractErrorMessage(error?.response?.data))
    }
  } 

  const tableColumns = ['COMPETENCIES', 'ITEMS', 'EMPLOYEE SELF ASSESSMENT', 'MANAGER ASSESSMENT'];
  let tableRows = [];
    
  selfQuestions?.forEach((data) => {
      const competency = data?.category;
      
      if (data.subcategories.length ) {
          data?.subcategories?.forEach((item, index) => {
            
              const userData = user?.selfAssessment?.length ?  [user?.selfAssessment[0]?.score[competency][item.subcategory]?.rating || "", user?.selfAssessment[0]?.score[competency][item.subcategory]?.comment || " "] : ["",""];
  
              const managerData = user?.managerAssessment?.length ? [user?.managerAssessment[0]?.score[competency][item.subcategory]?.rating || "", user?.managerAssessment[0]?.score[competency][item.subcategory]?.comment || " "] : ["",""];
          
          tableRows.push([
            index === 0 ? (competency?.toUpperCase()=== "RISK") ? "RISK-TAKING" : (competency?.toUpperCase() === "CONNECT" ? "PEOPLE-CONNECT":competency?.toUpperCase()) : '',    
            item.question,  
            userData? userData[0] : "",     
            managerData ?  managerData[0] : ""  
          ],
          [
            '',
            "comment",
            userData? userData[1] : "",     
            managerData ?  managerData[1] : ""         
          ]);
        });
      }
    });

  const downloadTableAsPDF = async ()=> {

      const pdf = new jsPDF('p', 'mm', 'a4');
      const startY = 30;
    
      pdf.addImage(logoPath, 'PNG', 20, 10, 10, 10,"","FAST");
    
      const userName = user?.name || 'User';
      const reportTitle = userName + " - Competency Report";
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(reportTitle, 50, 20);
    
      pdf.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: startY,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 40, halign: 'left' },
          1: { cellWidth: 50, halign: 'left' },
          2: { cellWidth: 55, halign: 'center' },
          3: { cellWidth: 40, halign: 'center' },
        },
        headStyles: { fillColor: [22, 160, 133], fontSize: 11 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      const element = document.getElementById('graphs');
      if (element && (user?.selfAssessment.length || user?.managerAssessment?.length)) {
        const canvas = await html2canvas(element,{
          // width: 800,
          height: 1300,
          // scale: 1 // Prevent scaling for desktop resolution
      });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = (1.55) * imgWidth;
    
        const page = pdf.addPage();
        page.addImage(imgData, 'PNG', 10, 6, imgWidth, imgHeight,"",'MEDIUM' );
      }

      const element2 = document.getElementById('final-table');
      if (element2 && (user?.selfAssessment.length || user?.managerAssessment?.length)) {
        const canvas2 = await html2canvas(element2,{
          // width: 800,
          // height: 1300,
          // scale: 1 // Prevent scaling for desktop resolution
      });
        const img2Data = canvas2.toDataURL('image2/png');
        const img2Width = 190;
        const img2Height = element2.offsetHeight*0.2;
    
        const page = pdf.addPage();
        page.addImage(img2Data, 'PNG', 10, 10, img2Width, img2Height,"MEDIUM" );
      }
      // const pdfDataUri = pdf.output('datauristring');
      // const newTab = window.open();
      // newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);

      pdf.save(`CompetencyAssessmentReport-${user?.name?.split(" ")[0] || "Employee"}.pdf`)
      alertCtx.setToast('success','PDF downloaded successfully!');
      
    }

  useEffect(()=>{
    getUser();  
  },[])

  return (
    <>
      <div className='flex text-start cursor-pointer text-xl items-center font-bold p-2' onClick={()=>{navigate("/")}}><IoIosArrowBack/> Back</div>
      {!loading ? 
                <div className='flex flex-col justify-center items-center overflow-auto'>
                { ((user?.managerId === loginCtx.userId)|| (loginCtx.role === "super-admin")) ?
                <>  
                    <div className='font-bold text-2xl'>Name : {user?.name}</div>
                    <div className='mb-2 font-medium'>Designation : {user?.designation}</div>
                    
                    <button className='p-2 px-4 bg-green-500 hover:bg-green-600 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl text-gray-100 font-semibold shadow-lg' onClick={downloadTableAsPDF}>Download report as PDF</button>
                     
                    {/* table */}
                    <div className="mx-2 my-6 mb-8 xl:mx-16 overflow-x-auto max-w-[95vw]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-teal-500 text-gray-100 dark:bg-teal-600">
                            {tableColumns.map((column, index) => (
                              <th
                                key={index}
                                className="p-2 text-center text-sm font-medium border border-gray-300 dark:border-gray-600"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.map((row, index) => (
                            <tr
                              key={index}
                              className={`${
                                index % 2 === 0
                                  ? "bg-gray-100 dark:bg-[#252525]"
                                  : "bg-white dark:bg-[#161616]"
                              }`}
                            >
                              {row.map((cell, i) => (
                                <td
                                  key={i}
                                  className={`p-2 text-sm border border-gray-300 dark:border-gray-600 ${
                                    i === 0 || i === 1 ? "text-left" : "text-center"
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>


                    {/* bar graphs */}
                    <div id="graphs" className='w-full p-2 lg:w-2/3 2xl:w-1/2'>
                        {/* <img src={image} className='w-100 mb-8' alt="" /> */}
                      {(user?.selfAssessment?.length > 0) &&
                          <>
                                <div className='z-10 mb-4 text-center w-full font-semibold text-lg md:text-2xl text-gray-800 dark:text-gray-400'>According to {user?.name} : <span className={`text-${getRank(user?.selfAssessment[0].score)[1]}`}> {getRank(user?.selfAssessment[0]?.score)[0] || ""} </span></div>
                                <BarGraph users={[user]} title="selfAssessment" twoD={true}/>
                                
                          </>
                        }
                        <>
                        <div className='flex w-full justify-center items-center my-4'>
                        <table className="w-[65%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black ">
                          <thead className="text-xs text-center text-gray-800 uppercase bg-white">
                              <tr>
                                  <th scope="col" className="px-6 py-1.5 font-extrabold border-r border-black ">
                                      Rating Range
                                  </th>
                                  <th scope="col" className="px-6 py-1.5 font-extrabold">
                                      Rating Description
                                  </th>
                              </tr>
                          </thead>
                          <tbody>             
                              <tr className="text-center border bg-gray-300 border-black ">
                                  <th scope="row" className="px-6 py-1.5 text-md font-bold text-gray-900 border-r border-black ">
                                      0-4
                                  </th>
                                  <th scope="row" className="px-6 py-1.5 font-semibold text-gray-900">
                                      Novice
                                  </th>
                              </tr>

                              <tr className="bg-orange-300 text-center border border-black ">
                                  <th scope="row" className="px-6 py-1.5 text-md font-bold text-gray-900 border-r border-black ">
                                      5-8
                                  </th>
                                  <th scope="row" className="px-6 py-1.5 font-semibold text-gray-900">
                                      Boomer
                                  </th>
                              </tr>

                              <tr className="bg-green-300 text-center border border-black ">
                                  <th scope="row" className="px-6 py-1.5 text-md font-bold text-gray-900 border-r border-black ">
                                      9-13
                                  </th>
                                  <th scope="row" className="px-6 py-1.5 font-semibold text-gray-900">
                                      Compliant
                                  </th>
                              </tr>

                            <tr className="bg-blue-300 text-center border border-black ">
                                <th scope="row" className="px-6 py-1.5 text-md font-bold text-gray-900 border-r border-black ">
                                    14-17
                                </th>
                                <th scope="row" className="px-6 py-1.5 font-semibold text-gray-900">
                                    Star
                                </th>
                            </tr>

                          <tr className="bg-yellow-200 text-center border border-black ">
                              <th scope="row" className="px-6 py-1.5 text-md font-bold text-gray-900 border-r border-black ">
                                  18-20
                              </th>
                              <th scope="row" className="px-6 py-1.5 font-semibold text-gray-900">
                                  Role-Model / Zenith
                              </th>
                          </tr>             
                          </tbody>
                         
                      </table>
                      </div>
                        </>
                      {
                      (user?.managerAssessment?.length > 0 ) &&
                        <>
                          <br />
                          <div className='z-10 mb-4 text-center w-full font-semibold text-lg md:text-2xl text-gray-800 dark:text-gray-400'>According to manager :<span className={`text-${getRank(user?.managerAssessment[0].score)[1]}`}> {getRank(user?.managerAssessment[0]?.score)[0] || ""} </span></div>
                          <BarGraph users={[user]} title="managerAssessment" twoD={true}/>
                        
                        </>
                      }
                    </div>


                    {/* final scores table */}
                    <div id="final-table" className='flex flex-col mt-6 w-full xl:w-[65%] 2xl:w-[50%] px-2 overflow-auto items-center justify-center'>
                      <label className='font-semibold text-xl text-gray-700 dark:text-gray-300' htmlFor="">ASSESSMENT SCORE</label>
                      <table className="border border-gray-500 dark:border-gray-300 w-full my-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-center text-gray-700 uppercase bg-indigo-200 dark:bg-[#353535] dark:text-gray-100">
                              <tr>
                                  <th scope="col" className="px-6 py-3 font-bold">
                                      COMPETENCY
                                  </th>
                                  <th scope="col" className="px-6 py-3 font-bold">
                                      SCORE BY SELF ({user?.name})
                                  </th>
                                  <th scope="col" className="px-6 py-3 font-bold">
                                      SCORE BY REPORTING MANAGER
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              {
                                  selfQuestions?.map((data, index)=>(
                                      <tr key={index} className="bg-white text-center border-b dark:bg-[#212121] dark:border-gray-700">
                                  <th scope="row" className="px-6 py-3 text-md font-bold text-gray-900 dark:text-white">
                                      {(data?.category.toUpperCase() === "RISK") ? "RISK-TAKING" : (data?.category.toUpperCase() === "CONNECT" ? "PEOPLE-CONNECT":data?.category.toUpperCase())}
                                  </th>
                                  <th scope="row" className="px-6 py-3 font-semibold text-gray-900 dark:text-white">
                                      {user?.selfAssessment?.length ? (getScore(data.category , user.selfAssessment[0]?.score) || "Yet to give score") : "Yet to give score"}
                                  </th>
                                  <td className="px-6 py-3 font-semibold text-gray-900 dark:text-white">
                                      {user?.managerAssessment?.length ? (getScore(data.category , user.managerAssessment[0]?.score)|| "Yet to receive score" ): "Yet to receive score"}
                                  </td>
                              </tr>
                                  ))
                              }
                              
                          </tbody>
                          <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-cyan-200 dark:bg-teal-500 text-center ">
                              <tr>
                                  <th scope="col" className="font-bold px-6 py-3">
                                      Average Score
                                  </th>
                                  <th scope="col" className="font-bold px-6 py-3">
                                  {(user?.selfAssessment?.length ? getAverageScore(user?.selfAssessment[0]?.score).toFixed(2) : "NA")}
                                  </th>
                                  <th scope="col" className="font-bold px-6 py-3">
                                  {(user?.managerAssessment?.length ? getAverageScore(user?.managerAssessment[0]?.score).toFixed(2) :  "NA")}
                                  </th>
                              </tr>
                          </thead>
                      </table>
                    </div>
                </>
              :
              <>
              <div className="flex text-black dark:text-gray-100 w-full min-h-[80vh] justify-center items-center">
                    You are not authorized to access this page!
                  </div>
              </>
            }
        </div>
        :
        <>
        <div className="flex text-black dark:text-gray-100 w-full min-h-[80vh] justify-center items-center">
                    Loading....
                  </div>
        </>
    }
   
  </>
  )
}

export default AssessmentReport





















