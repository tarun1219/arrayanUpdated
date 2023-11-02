import React from 'react'
import UserSignUp from '../components/UserSignUp'
import Background from '../components/Background'
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../context/AuthContext'
const Login = () => {
  return (
    <AuthProvider>
      <Background>
        <Container 
             className="d-flex align-items-center"
             style={{minHeight: "100vh"}}
        >
            <div className="w-100" style={{maxWidth: '400px'}}>
                <UserSignUp />
            </div>
        </Container>
    </ Background>

    </AuthProvider>  
  )
}
export default Login; 