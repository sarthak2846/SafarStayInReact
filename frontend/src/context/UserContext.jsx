import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext.jsx';
import axios from 'axios';

export const userDataContect = createContext();

function UserContext({children}) {
    let {serverUrl} = useContext(authDataContext);
    let [userData,setUserData]= useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = async ()=>{
        try {
          let result =  await axios.get(serverUrl+'/api/user/currentuser',{withCredentials:true});
         
          setUserData(result.data);
          
        } catch (error) {
            setUserData(null);
            console.log(error);
        } finally {
      setLoading(false);
    }
    }

    useEffect(()=>{
        getCurrentUser();
        
    },[]);

    let value =
    {
        userData,
        setUserData,
        loading,
        setLoading,
        getCurrentUser

    }
  return (
    <div>
      <userDataContect.Provider value={value}>
        {children} 
      </userDataContect.Provider>
    </div>
  )
}

export default UserContext
