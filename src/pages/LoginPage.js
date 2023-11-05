import React from 'react'
import Login from '../components/Login'
import Background from '../components/Background'
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../context/AuthContext'
const LoginPage= () => {
  return (
    <AuthProvider>
      <Background>
        <Container 
             className="d-flex align-items-center"
             style={{minHeight: "100vh"}}>
            <div className="w-100" style={{maxWidth: '400px'}}>
                <Login />
            </div>
        </Container>
    </ Background>

    </AuthProvider>  
  )
}
export default LoginPage; 