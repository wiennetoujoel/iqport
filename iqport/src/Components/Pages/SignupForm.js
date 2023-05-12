import React, { useState } from "react";
import app from '../../firebase.js'
import "./SignupForm.css"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupForm() {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = (email) => {
    // Regex untuk memvalidasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signUpWithEmail = () => {
    if (!isEmailValid(email)) {
      alert("Email tidak valid. Mohon periksa kembali")
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed Up
          const user = userCredential.user;
          sendEmailVerification(auth.currentUser)
            .then(() => {
              // Email verification sent
              console.log("Email verification sent");
              alert("Berhasil Menambahkan akun. Silakan cek email untuk verifikasi.");
            })
            .catch((error) => {
              // Error sending email verification
              console.log("Error sending email verification:", error);
              alert("Terjadi kesalahan saat mengirim email verifikasi.");
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          alert(errorMessage);
        });

    }

  };

  const signUpWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        // Signed Up with Google
        const user = userCredential.user;
        console.log(user);
        alert("Berhasil Mendaftar dengan akun Google");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
      });
  };



  return (
    <div className="login-form">
      <h2>Sign Up</h2>
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
        <button className="email-button" type="button" onClick={signUpWithEmail}>Sign Up</button>
        <br />
        <p style={{ textAlign: "center" }}>or</p>
        <button className="google-btn" type="button" onClick={signUpWithGoogle}>
          Sign Up with Google
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
