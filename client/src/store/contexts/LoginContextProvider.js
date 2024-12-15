import { useContext, useState } from "react"
import { useCookies } from "react-cookie"
import { createContext } from "react";

export const loginContext = createContext()

function LoginContextProvider({children}){
    const [, setCookie] = useCookies(["token :  nothing"]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId , setUserId] = useState(null);
    const [name , setName] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);

    const loginHandler = ( id , name , role, token) => {
        setIsLoggedIn(true);
        setUserId(id);
        setName(name);
        setRole(role);
        setTokenHandler(token);
    }

    const logoutHandler = () => {
        setIsLoggedIn(false);
        setName(null);
        setUserId(null);
        setRole(null);
        setToken(null);
        setCookie(
            "token",
            null,
            {
                path:"/",
                maxAge:0
            }
        );
    }

    const setTokenHandler  = (newToken) => {
        setCookie("token", newToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 3,
          });
        setToken(newToken);
    }

    const context = {
        isLoggedIn : isLoggedIn,
        userId : userId,
        name : name,
        role : role,
        token : token,
        login : loginHandler,
        logout : logoutHandler,
        setToken : setTokenHandler,
    }

    return(
        <loginContext.Provider value={context}>
            {children}
        </loginContext.Provider>
    )
}

const useLogin = () => useContext(loginContext)

export {useLogin , LoginContextProvider};
