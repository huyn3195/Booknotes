import React, { Fragment, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { toast } from 'react-toastify';
import "../styles/Background.css";

function Login({ setAuth }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const { email, password } = inputs;
  const navigate = useNavigate(); // Initialize useNavigate hook

  function onChange(event) {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  }

  async function onSubmitForm(event) {
    event.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success('You have logged in successfully');
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  function redirectToRegister() {
    navigate('/register'); // Navigate to /register
  }
  function redirectToLanding(){
    navigate('/');
  }

  return (
    <div className="login-container">
      <div className="image-section">
        <img src="https://static01.nyt.com/images/2017/05/11/t-magazine/bookstore-slide-2MCD/bookstore-slide-2MCD-superJumbo.jpg" alt="Login" className="background-image" />
      </div>
      <div className="form-section">
        <Fragment>
          <h1 className="form-title">Login</h1>
          <form onSubmit={onSubmitForm}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                aria-describedby="emailHelp"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                onChange={onChange}
                value={password}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <button type="button" className="btn btn-secondary" onClick={redirectToRegister}>
                Register
              </button>
              <button type="button" className="btn btn-secondary" onClick={redirectToLanding}>Welcome page</button>
            </div>
          </form>
        </Fragment>
      </div>
    </div>
  );
}

export default Login;
