import UserSignUp from "./components/UserSignUp";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage"
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard";
import React from "react"
import { Container } from "react-bootstrap"
import Login from "./components/Login";

// import PrivateRoute from "./PrivateRoute"
// import ForgotPassword from "./ForgotPassword"
// import UpdateProfile from "./UpdateProfile"

function App() {
  return (

      <div>
        <Router>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/login" element={<LoginPage/>} />
              {/* <Route path="/" component={Dashboard} /> */}
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    //<Login/>
  )
}

export default App
