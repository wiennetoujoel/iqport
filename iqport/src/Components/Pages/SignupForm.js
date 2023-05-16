import React, { useState } from "react";
import "./SignupForm.css";
import axios from "axios";

const SignupForm = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    if (!isEmailValid(email)) {
      setErrorMessage("Invalid email. Please check again.");
      return;
    }

    if (password !== password2) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    axios
      .post("http://34.101.124.69:3300/main/register", {
        username,
        email,
        password,
        password2,
      })
      .then((response) => {
        // Signup success
        console.log(response.data);
        alert("Signup successful. Please check your email for verification.");
      })
      .catch((error) => {
        // Signup error
        console.log(error.response.data);
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            placeholder="Please enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            placeholder="Please enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            placeholder="Please enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            placeholder="Please confirm your password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </label>
        <br />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="signup-button" type="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
