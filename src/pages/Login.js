import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [err, catchError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chats");
    } catch (err) {
      catchError(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">zLhYd Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="email" />
          <input name="password" type="password" placeholder="password" />
          <button type="submit">Sign In</button>
          {err && <p>Something wrong</p>}
        </form>
        <p>
          You do have account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
