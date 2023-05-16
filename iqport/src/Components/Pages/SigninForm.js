import React, { useState } from "react";
import axios from "axios";
import "./SigninForm.css"

const SigninForm = ({ handleLogin }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Menambah state untuk pesan kesalahan

  const openOverlay = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState({ loggedIn: false, photoURL: "" });
  

  const signInWithEmail = () => {
    axios
      .post("http://34.101.124.69:3300/main/login", { email, password },  { withCredentials: true })
      .then((response) => {
        const { success, email, username } = response.data;
        if (success) {
          handleLogin(email, username);
          localStorage.setItem(
            "loggedIn",
            JSON.stringify({
              loggedIn: true,
              email,
              username,
            })
          );
        } else {
          setErrorMessage("*Email or password is incorrect");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("*An error occurred. Please try again.");
      });
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };



  return (
    <div className={`overlay ${showOverlay ? "active" : ""}`} onClick={closeOverlay}>
      <div className="login-form" onClick={handleFormClick}>
        <h2>Sign In</h2>
        <form>
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="email-button" type="button" onClick={signInWithEmail}>
            Sign In
          </button>
          <br />
        </form>
      </div>
    </div>
  );
};

export default SigninForm;
