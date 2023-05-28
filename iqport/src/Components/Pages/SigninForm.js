import React, { useState } from "react";
import axios from "axios";
import "./SigninForm.css"


const SigninForm = ({ handleLogin, closeOverlay }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Menambah state untuk pesan kesalahan

  const openOverlay = () => {
    setShowOverlay(true);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState({ loggedIn: false, photoURL: "" });


  const signInWithEmail = () => {
    axios
      .post("https://aqport.my.id/main/login", { email : email, password : password }, { withCredentials: true },{
        headers:{
          'Access-Control-Allow-Origin': '*', // Mengatur header Access-Control-Allow-Origin
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept' // Mengatur header Access-Control-Allow-Headers
        }
      })
      .then((response) => {
        const {email, username} = response.data.data; // Menambahkan token ke respons data
        const token = response.data.token;
        const message = response.data.message;
        if (response.status === 200) {  
          handleLogin(email, username, token, message);
            localStorage.setItem(
              "loggedIn",
              JSON.stringify({
                loggedIn: true,
                email,
                username,
                token, 
                message,
              })
          );
          closeOverlay();
        } else {
          console.log(response.data.data)
          console.log(response.data.token)
          console.log(response.data.message)
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
