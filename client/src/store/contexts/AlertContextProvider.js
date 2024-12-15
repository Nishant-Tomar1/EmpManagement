import { createContext, useContext, useState } from "react";

export const alertContext = createContext()

function AlertContextProvider({children}){
    const [toast, setToast] = useState({
        visible : false,
        type : "",
        message : "",
        onConfirm : ()=>{}
    });

    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        message: '',
        onConfirm: null,
    });

    const setToastHandler = ( toastType , toastMessage) => {
        setToast(prev => ({...prev, visible : true, type : toastType, message :toastMessage}))
        if (toastType !== "confirm" ){
                setTimeout(()=>{
                setToast(prev => ({...prev, visible : false, type : "", message : ""}))
            },3000)
        }
    }

    const unSetToast = () => {
        setToast(prev => ({...prev, visible : false, type : "", message : ""}))
    }

//-----------------------------------------------------------------------------
    
    const showConfirmHandler = (message, onConfirm) => {
        setConfirmState({
            isOpen: true,
            message,
            onConfirm,
        });
    };

    const hideConfirmHandler = () => {
        setConfirmState({ ...confirmState, isOpen: false });
    };

    const handleConfirmFuntion = () => {
        if (confirmState.onConfirm) {
            confirmState.onConfirm();
        }
        hideConfirmHandler();
    };

    const context = {
        toast : toast,
        confirmState : confirmState,
        unSetToast : unSetToast,
        setToast : setToastHandler,
        showConfirm : showConfirmHandler,
        hideConfirm : hideConfirmHandler,
        handleConfirm : handleConfirmFuntion
    }

    return (
        <alertContext.Provider value={context}>
            {children}
        </alertContext.Provider>
    )

}

const useAlert = () => useContext(alertContext)

export {AlertContextProvider, useAlert}