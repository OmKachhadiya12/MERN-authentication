import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn,setisLoggedIn] = useState(false);
    const [userData,setuserData] = useState(false);

    const getUserData = async() => {
        try {
            const {data} = await axios.get(backendurl + 'user/getdata');
            data.success ? setuserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(data.message);
        }
    }

    const value = {
        backendurl,isLoggedIn,setisLoggedIn,userData,setuserData,getUserData
    }
    return ( 
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}