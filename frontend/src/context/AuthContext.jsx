import React, { createContext, useState } from 'react'
export const authDataContext = createContext();

let serverUrl = 'https://safarstay-backend.onrender.'


function AuthContext({children}) {
  let [loading,setLoading]=useState(false);
  const value =
{
  serverUrl,
  loading,setLoading
}

  

  return (
    <div>
      <authDataContext.Provider value={value}>
         {children}
      </authDataContext.Provider>
    </div>
  )
}

export default AuthContext
