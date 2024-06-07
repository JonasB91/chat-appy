
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from './components/Register'
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        {isLoggedIn}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
