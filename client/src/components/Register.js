import React, { Fragment, useState } from "react";
import { useNavigate } from 'react-router-dom'; 

function Register({ setAuth }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });
  const { email, password, name } = inputs;
  const navigate = useNavigate();

  function onChange(event) {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  }

  async function onSubmitForm(event) {
    event.preventDefault();
  
    // Validate inputs
    if (!email || !password || !name) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const body = { email, password, name };
      
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const parseRes = await response.json();
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        navigate('/dashboard'); // Redirect to the dashboard on successful registration
      } else {
        // Handle errors returned from the server
        const error = await response.json();
        alert(error.message || "An error occurred during registration.");
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
      alert('An error occurred during registration.');
    }
  }
  
  function redirectToLogin() {
    navigate('/login'); // Navigate to /register
  }

  return (
    <section className="vh-100" style={{ backgroundColor: '#eee' }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                    <form onSubmit={onSubmitForm} className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div data-mdb-input-init className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Your Name"
                            value={name}
                            onChange={onChange}
                          />
                         
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div data-mdb-input-init className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Your Email"
                            value={email}
                            onChange={onChange}
                          />
                          
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div data-mdb-input-init className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                          />
                        
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-primary btn-lg">
                          Register
                        </button>
                        <div className="text-center">
                          <p>
                            Already have an account?{" "}
                            <a href="/login" onClick={(e) => { 
                               e.preventDefault(); // Prevent the default anchor behavior
                               redirectToLogin();  // Use the redirect function to navigate
                                 }}>
                               Login here
                            </a>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://img.buzzfeed.com/buzzfeed-static/static/2017-03/23/15/asset/buzzfeed-prod-fastlane-01/sub-buzz-27949-1490298158-6.jpg"
                      className="img-fluid"
                      alt="Sample"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
