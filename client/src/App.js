import React, { Fragment, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";
import About from "./components/About";
import SearchResults from "./components/SearchResult";
import Post from "./components/Post";
import Save from "./components/Save";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Routes>
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/search"
              element={<SearchResults setAuth={setAuth} />}
            />
            <Route
              path="/post"
              element={
                isAuthenticated ? (
                  <Post setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/save"
              element={isAuthenticated ? <Save /> : <Navigate to="/login" />}
            >
              ;
            </Route>
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
