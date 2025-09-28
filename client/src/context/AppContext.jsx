import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn,setisLoggedIn] = useState(false);
    const [userData,setuserData] = useState(false);

    const getAuthStatus = async() => {
        try {
            const {data} = await axios.get(backendurl + '/auth/isAuthenticated');
            if(data.success) {
                setisLoggedIn(true);
                getUserData();
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getUserData = async() => {
        try {
            const {data} = await axios.get(backendurl + 'user/getdata');
            data.success ? setuserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect( () => {
        getAuthStatus();
    } , [])

    const value = {
        backendurl,isLoggedIn,setisLoggedIn,userData,setuserData,getUserData
    }
    return ( 
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}