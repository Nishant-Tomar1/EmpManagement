import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts, { color } from 'highcharts';
import HighCharts3d from "highcharts/highcharts-3d";
import {Exporting} from "highcharts/modules/exporting";
import {ExportData }from "highcharts/modules/export-data"; 
import {OfflineExporting} from "highcharts/modules/offline-exporting";
import { useTheme } from '../store/contexts/ThemeContextProvider';

function PeiChart({score}) {
    const [graphTheme, setGraphTheme] = useState({
      backgroundColor : "#ffffff",
      textColor : "#000000"
    })

    const themeCtx = useTheme();
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
    const getData = (score, pie)=>{
        const data = [];
        for (let key in score){
            data.push([key, getScore(key)]);
        }
        if (data.length && pie){
            const temp = data.pop();
            data.push({
                name: temp[0],
                y: temp[1],
                sliced: true,
                selected: true
            })
        }
        return data;
    }
     const getDynamicStyles = () => {
                const container = document.getElementById("pie-chart-container");
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
        },[themeCtx.theme,score])

    const options = {
        chart: {
          type: "pie",
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
          },
          backgroundColor: graphTheme.backgroundColor, 
        },
        credits: {
          enabled: false,
        },
        title: {
          text: "Assessment Report",
          style: {
            color: graphTheme.textColor,
            backgroundColor: graphTheme.backgroundColor, 
          },
        },
        accessibility: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 35,
            dataLabels: {
              enabled: true,
              format: "{point.name}",
              style: {
                color: graphTheme.textColor,
                backgroundColor: graphTheme.backgroundColor, 
              },
            },
          },
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
        series: [
          {
            type: "pie",
            name: "Score",
            data: getData(score, true),
          },
        ],
      };
         

  return (
    <div className='flex flex-col xl:flex-row w-full '>
        <div className='flex flex-co xl:w-1/2 items-center justify-center'>
        <div id="pie-chart-container"
    className="dark:bg-[#191919] bg-white dark:text-gray-100 text-gray-700 w-full max-w-[100vw] overflow-auto">
            <HighchartsReact
            highcharts={Highcharts}
            options={options}/>
            </div>
        </div>

        <div className='flex flex-col w-full sm:w-[90%] xl:w-half items-center justify-center'>
            <label className='font-semibold text-xl' htmlFor="">Assessment Score</label>

                <table className="w-[70%] my-6 px-1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-center text-gray-700 uppercase bg-indigo-200 dark:bg-[#353535] dark:text-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-bold">
                                S.No
                            </th>
                            <th scope="col" className="px-6 py-3 font-bold">
                                Competencies
                            </th>
                            <th scope="col" className="px-6 py-3 font-bold">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getData(score, false).map((data, index)=>(
                                <tr key={index} className="bg-white text-center border-b dark:bg-[#212121] dark:border-gray-700">
                            <th scope="row" className="px-6 py-3 font-bold text-gray-900 dark:text-white">
                                {index+1}
                            </th>
                            <th scope="row" className="px-6 py-3 font-bold text-gray-900 dark:text-white">
                                {data[0]}
                            </th>
                            <td className="px-6 py-3 font-medium text-center">
                                {data[1]}
                            </td>
                        </tr>
                            ))
                        }
                        
                    </tbody>
                    <thead className="text-xs text-gray-700 dark:text-gray-100 uppercase bg-gray-100 dark:bg-[#353535] text-center">
                        <tr>
                            <th scope="col" className="font-bold px-6 py-3">
                                Total Score
                            </th>
                            <th scope="col" className="font-bold px-6 py-3">
                                
                            </th>
                            <th scope="col" className="font-bold px-6 py-3">
                            {getTotalScore()}
                            </th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-cyan-200 dark:bg-teal-500 text-center ">
                        <tr>
                            <th scope="col" className="font-bold px-6 py-3">
                                Average Score
                            </th>
                            <th scope="col" className="font-bold px-6 py-3">
                                
                            </th>
                            <th scope="col" className="font-bold px-6 py-3">
                            {(getTotalScore()/getData(score, false).length).toFixed(2)}
                            </th>
                        </tr>
                    </thead>
                </table>

        </div>
    </div>
  )
}

export default PeiChart
