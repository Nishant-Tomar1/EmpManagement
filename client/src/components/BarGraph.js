import React,{useEffect, useState} from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts';
import HighCharts3d from "highcharts/highcharts-3d";
import { selfQuestions } from '../constants';
import {Exporting} from "highcharts/modules/exporting";
import {ExportData }from "highcharts/modules/export-data"; 
import {OfflineExporting} from "highcharts/modules/offline-exporting";
import { MdDragIndicator } from 'react-icons/md';
import { useTheme } from '../store/contexts/ThemeContextProvider';


function BarGraph({users, title, twoD = false }) {
    const [graphTheme, setGraphTheme] = useState({
      backgroundColor : "#ffffff",
      textColor : "#000000"
    })

    const themeCtx = useTheme();

    const getScore = (category,score )=>{
            let sum = 0;
            for (let data in score[category]){
              sum += score[category][data]?.rating || 0;
            }
            return sum;
          }

    const getZeroData = ()=>{
        let data = [];
        for (let temp in selfQuestions){
            data.push([selfQuestions[temp].category,0]);
        }
        return data;
        
    }

    const getData = ()=>{
            let series = [];
            
            const category = ["selfAssessment","managerAssessment"].includes(title) ? title : "selfAssessment"
            users?.map((user)=>{
                const temp = [];
                if (!user[category].length){
                    series.push({name:user.name,data:getZeroData()});
                }
                if (user[category].length){
                    for (let key in user[category][0]?.score){
                        temp.push([key, getScore(key,user[category][0]?.score)]);
                    }
                    series.push({
                        name :user?.name ,
                        data : temp
                     })   
                }
               
            })
            
            return series ;
        }  
       
    const getDynamicStyles = () => {
            const container = document.getElementById("chart-container");
            if (container) {
              const styles = getComputedStyle(container);
              
                setGraphTheme(prev => ({
                  ...prev,
                  backgroundColor: styles.backgroundColor,
                  textColor : styles.color
                }))
              return;
            }
          }; 
          
    useEffect(()=>{
            getDynamicStyles();
    },[themeCtx.theme,users])

    const options = {
                chart: {
                  type: "column",
                  options3d: {
                    enabled: !twoD,
                    alpha: 10,
                    beta: 25,
                    depth: 70,
                  },
                  backgroundColor: graphTheme.backgroundColor,
                },
                title: {
                  text: !twoD ? (title === "managerAssessment" ? "Manager - Assessment" : "Self - Assessment") : "",
                  style: {
                    color: graphTheme.textColor, 
                  },
                },
                credits: {
                  enabled: false,
                },
                plotOptions: {
                  column: {
                    depth: 25,
                    dataLabels: {
                      enabled: true, // Show labels on top of bars
                      style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: graphTheme.textColor,
                      },
                      format: '{y}', // Display the score value
                    },
                  },
                },
                accessibility: {
                  enabled: false,
                },
                legend: {
                  itemStyle: {
                    color: graphTheme.textColor, 
                  },
                  backgroundColor: graphTheme.backgroundColor, 
                },
                xAxis: {
                  type: "category",
                  labels: {
                    skew3d: true,
                    style: {
                      fontSize: "16px",
                      color: graphTheme.textColor, 
                    },
                  },
                },
                yAxis: {
                  title: {
                    text: "Score",
                    margin: 20,
                    style: {
                      color: graphTheme.textColor, 
                    },
                  },
                  labels: {
                    style: {
                      color: graphTheme.textColor, 
                    },
                  },
                  gridLineColor: "#444444", 
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      align: "right",
                      verticalAlign: "top",
                      x: -5,
                      y: 5,
                    },
                  },
                },
                series: getData(),
            };
              
  return (
    <div >

     {(users.length) ? 
        <div id="chart-container"
        className="dark:bg-[#191919] bg-white dark:text-gray-100 text-gray-700">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}/>
        </div>
        :
        <></>
    }
    </div>
  )
}

export default BarGraph
