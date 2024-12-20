import React, { useEffect, useState , useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {useAlert} from "../store/contexts/AlertContextProvider"
import { useLogin } from '../store/contexts/LoginContextProvider';
import {extractErrorMessage, selfQuestions, Server} from '../constants'
import logoPath from '../assets/logos/logo2.png';
import axios from 'axios'
import { IoIosArrowBack } from 'react-icons/io';
import image from "../assets/utils/image.png";
import BarGraph from '../components/BarGraph';
import html2canvas from 'html2canvas'


function AssessmentReport() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const {userId} = useParams()
  const alertCtx = useAlert()
  const loginCtx = useLogin()
  const navigate = useNavigate()
  const chartRef = useRef(null);

  const getScore = (category, score)=>{
    let sum = 0;
    for (let data in score[category]){
      sum += score[category][data]?.rating || 0;
    }
    return sum;
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
            index === 0 ? competency?.toUpperCase() : '',    
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
    
      pdf.addImage(logoPath, 'PNG', 10, 10, 40, 17);
    
      const userName = user?.name || 'User';
      const reportTitle = userName + " - Competency Report";
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(reportTitle, 60, 20);
    
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
          3: { cellWidth: 45, halign: 'center' },
        },
        headStyles: { fillColor: [22, 160, 133], fontSize: 11 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      const element = document.getElementById('graphs');
      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        const page = pdf.addPage();
        page.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight,"",'MEDIUM' );
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
      <div className='flex text-start cursor-pointer text-2xl items-center font-bold p-2' onClick={()=>{navigate("/")}}><IoIosArrowBack/> Back</div>
      {!loading ? 
                <div className='flex flex-col justify-center items-center overflow-auto'>
                { (user?.managerId === loginCtx.userId ) ?
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
                        <img src={image} className='w-100 mb-8' alt="" />
                      {(user?.selfAssessment?.length > 0) &&
                          <>
                                <div className='z-10 mb-4 text-center w-full font-semibold text-lg md:text-2xl text-gray-800 dark:text-gray-400'>According to {user?.name} : <span className={`text-${getRank(user?.selfAssessment[0].score)[1]}`}> {getRank(user?.selfAssessment[0]?.score)[0] || ""} </span></div>
                                <BarGraph users={[user]} title="selfAssessment" twoD={true}/>
                                
                          </>
                        }
                      {
                      (user?.managerAssessment?.length > 0 ) &&
                        <>
                          <br />
                          <div className='z-10 mb-4 text-center w-full font-semibold text-lg md:text-2xl text-gray-800 dark:text-gray-400'>According to manager :<span className={`text-${getRank(user?.managerAssessment[0].score)[1]}`}> {getRank(user?.managerAssessment[0]?.score)[0] || ""} </span></div>
                          <BarGraph users={[user]} title="managerAssessment" twoD={true}/>
                        
                        </>
                      }
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





















