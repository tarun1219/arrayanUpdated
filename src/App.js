import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage"
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React from "react"
import InventoryPage from "./pages/InventoryPage";
import SupplyChainPage from "./pages/SupplyChainPage";

function App() {
  return (
    
      <div>
        <Router>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/login" element={<LoginPage/>} />
              <Route exact path="/inventory" element={<InventoryPage/>} />
              <Route exact path="/track" element={<SupplyChainPage/>} />
              {/* <Route path="/" component={Dashboard} /> */}
            </Routes>
          </AuthProvider>
        </Router>
      </div>
  )
}

export default App
