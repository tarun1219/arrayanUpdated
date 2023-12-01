import React from 'react'
import UserSignUp from '../components/UserSignUp'
import { AuthProvider } from '../context/AuthContext'
import IndexNavbar from '../components/Navbars/IndexNavbar'
const RegisterPage = () => {
  return (
    <AuthProvider>
      <IndexNavbar/>
      <UserSignUp/>
    </AuthProvider>  
  )
}
export default RegisterPage; 