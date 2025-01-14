import React, {useEffect}from 'react'
import { useAlert } from '../store/contexts/AlertContextProvider.js';
import { useTheme } from '../store/contexts/ThemeContextProvider.js';

function Toast() {
    const alertCtx = useAlert();
    const {theme} = useTheme()

    useEffect(() => {
        // console.log(alertCtx);
        
    }, [alertCtx.toast]);

    return (
    
    <div className={`flex flex-col justify-center items-center ${theme} `}>
        {alertCtx.toast.visible &&
        <div className='fixed top-4 lg:top-4 z-[100]'>
        {  alertCtx.toast.type === "success" &&
            <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 border-2 border-green-500 dark:border-1 dark:border-gray-400 text-gray-500 bg-white rounded-lg dark:text-gray-400 dark:bg-[#171717] shadow-lg dark:shadow-[#000000]" role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span className="sr-only">Check icon</span>
            </div>
            <div className="ms-3 text-sm font-normal text-gray-800 dark:text-gray-100">{alertCtx.toast.message}</div>
            <button type="button" onClick={ () => alertCtx.unSetToast()} className="ms-2 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                {/* <span className="sr-only">Close</span>/ */}
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
        }
        {   alertCtx.toast.type === "error" &&
            <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 border-2 border-red-500 dark:border-1 dark:border-gray-400 text-gray-500 bg-white rounded-lg  dark:text-gray-400 dark:bg-[#171717] shadow-lg dark:shadow-[#000000] " role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>
                <span className="sr-only">Error icon</span>
            </div>
            <div className="ms-3 text-sm font-normal text-gray-800 dark:text-gray-100">{alertCtx.toast.message}</div>
            <button type="button" onClick={ () => alertCtx.unSetToast()} className="ms-2 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
        }
        {   alertCtx.toast.type === "warning" &&
            <div id="toast-warning" className="flex items-center w-full max-w-xs p-4 border-2 border-orange-500 dark:border-1 dark:border-gray-400 text-gray-500 bg-white rounded-lg dark:text-gray-400 dark:bg-[#171717] shadow-lg dark:shadow-[#000000]" role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
                </svg>
                <span className="sr-only">Warning icon</span>
            </div>
            <div className="ms-3 text-sm font-normal text-gray-800 dark:text-gray-100">{alertCtx.toast.message}</div>
            <button type="button" onClick={ () => alertCtx.unSetToast()} className="ms-2 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
                {/* <span className="sr-only">Close</span> */}
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
        } 
        {   alertCtx.toast.type === "info" &&
            <div id="toast-info" className="flex items-center w-full max-w-xs p-4 border-2 border-blue-500 dark:border-1 dark:border-gray-400 text-gray-500 bg-white rounded-lg dark:text-gray-400 dark:bg-[#171717] shadow-lg dark:shadow-[#000000]" role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-700 dark:text-blue-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
                </svg>
                <span className="sr-only">Info icon</span>
            </div>
            <div className="ms-4 text-sm font-normal text-gray-800 dark:text-gray-100">{alertCtx.toast.message}</div>
            <button type="button" onClick={ () => alertCtx.unSetToast()} className="ms-2 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
        } 
        </div>}

        {alertCtx.confirmState.isOpen && 
        <div className='fixed top-4  z-[100]'>
            <div id="toast-interactive" className="flex items-center w-full max-w-[92vw] lg:max-w-[540px] p-4 border-2 border-orange-400 dark:border-gray-200 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-[#222222]" role="alert">
                <div className="flex">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-400 bg-gray-100 rounded-lg dark:text-gray-200 dark:bg-gray-600">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                        </svg>
                        <span className="sr-only">Refresh icon</span>
                    </div>
                    <div className="ms-4 me-3 text-sm font-normal">
                        <div className="mb-2 text-center text-md font-normal text-gray-800 dark:text-gray-100">{alertCtx.confirmState.message}</div> 
                        <div className="grid grid-cols-2 gap-2 ">
                            <div>
                                <button onClick={()=>{alertCtx.handleConfirm()}} className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-orange-200 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800">Yes</button>
                            </div>
                            <div>
                                <button onClick={()=>{alertCtx.hideConfirm()}} className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">No</button> 
                            </div>
                        </div>    
                    </div>
                    <button type="button" onClick={ () => alertCtx.hideConfirm()} className="ms-auto -mx-1.5 -my-1.5 bg-white items-center justify-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-300 dark:hover:text-white dark:bg-[#222222] dark:hover:bg-[#232323]" data-dismiss-target="#toast-interactive" aria-label="Close">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>}
    </div>
  )
}

export default Toast
