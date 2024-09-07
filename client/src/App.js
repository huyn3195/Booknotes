import React, { Fragment, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Dashboard from "./components/Dashboard.js";
import Welcome from "./components/Welcome.js";
import About from "./components/About.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = boolean =>{
    setIsAuthenticated(boolean);
  }

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Routes>
            {/* Conditionally render the Login component or redirect to Dashboard */}
            <Route
              path="/login"
              element={!isAuthenticated ? <Login  setAuth={setAuth}/> : <Navigate to="/dashboard" />}
            />
            {/* Register route */}
            <Route
              path="/register"
              element={!isAuthenticated ? <Register  setAuth={setAuth}/> : <Navigate to="/dashboard" />}
            />
            {/* Conditionally render the Dashboard component or redirect to Login */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard setAuth ={setAuth} /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;

