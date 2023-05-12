import React, { useState } from "react";
import app from '../../firebase.js'
import "./SigninForm.css"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SigninForm =({handleLogin})=> {
    const [showOverlay, setShowOverlay] = useState(false);

    const openOverlay = () => {
        setShowOverlay(true);
    };

    const closeOverlay = () => {
        setShowOverlay(false);
    };

    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState({ loggedIn: false, photoURL: "" });

    const signInWithEmail = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                setLoggedIn({ loggedIn: true, photoURL: user.photoURL, email: user.email, });
                handleLogin(user.photoURL, user.email); 
                handleLogin(user.photoURL, user.email);
                localStorage.setItem(
                  "loggedIn",
                  JSON.stringify({
                    loggedIn: true,
                    photoURL: user.photoURL,
                    email: user.email,
                  }));     
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    }

    const handleFormClick = (e) => {
        e.stopPropagation(); // Mencegah penyebaran event klik ke elemen overlay
    };


    return (
        <div className="overlay" onClick={handleFormClick}>
            <div className="login-form">
                <h2>Sign In</h2>
                <form>
                    <label>
                        Email:
                        <input type="email" placeholder="Please enter your email" onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" placeholder="Please enter your password" onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <br />
                    <button className="email-button" type="button" onClick={signInWithEmail}>Sign In</button>
                    <br />
                </form>
            </div>
        </div>
    );
}

export default SigninForm;
