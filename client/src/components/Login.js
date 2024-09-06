import React, {Fragment,useState} from "react";
import {toast} from 'react-toastify';


function Login({ setAuth }) {
  const [inputs,setInputs] = useState({
    email: "",
    password: ""
  });
  const {email,password} = inputs;
  function onChange(event){
    const {name,value} = event.target;
    setInputs((prevInputs)=>({
      ...prevInputs,
      [name]:value
    }));
  }
  async function onSubmitForm(event){
    event.preventDefault();
    try{
      const body = {email,password};
      const response = await fetch("http://localhost:3000/auth/login",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });
      const parseRes = await response.json()
      if(parseRes.token){
        localStorage.setItem("token",parseRes.token)
        setAuth(true)
        toast.success('You have logged in successfully');
      }else{
        setAuth(false);
        toast.error(parseRes);
      }

    }catch(err){
      console.error(err.message)
    }
  }
  return (
    <Fragment>
      <h1>Login</h1>
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
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </Fragment>
  );
}
export default Login