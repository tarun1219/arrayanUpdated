import React from 'react'
import Login from '../components/Login'
import { AuthProvider } from '../context/AuthContext'
import IndexNavbar from '../components/Navbars/IndexNavbar'
const LoginPage= () => {
  return (
    <AuthProvider>
      <IndexNavbar/>
      <Login/>
    </AuthProvider>  
  )
}
export default LoginPage; 