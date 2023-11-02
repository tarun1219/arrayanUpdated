import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../auth/firebaseAuthSDK'

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}
export function AuthProvider({children}) {
    const [currentUser, setCurrentUser]= useState()
    const [loading, setLoading]= useState(true)

    const value={
        currentUser,
        signup
    }
    function signup(email,password){
       return auth.createUserWithEmailAndPassword(email,password);
    }
    
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        
        return unsubscribe
    },[])

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}
