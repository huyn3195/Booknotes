import React, { Fragment, useState } from "react";

function Register({setAuth}) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });
  const { email, password, name } = inputs;

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
      const body = { email, password, name };
      
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
        localStorage.setItem("token",parseRes.token);
        setAuth(true);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  }
  

  return (
    <Fragment>
      <h1 className="text-center my-5">Register</h1>
      <form onSubmit={onSubmitForm}> {/* Changed onSubmitForm to onSubmit */}
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={onChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Name"
            value={name}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Fragment>
  );
}

export default Register;
