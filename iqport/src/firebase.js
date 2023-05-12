// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCI2qV9WzzfKSV9J7wNReT8YuV4Opuih0w",
  authDomain: "omega-clarity-379009.firebaseapp.com",
  databaseURL: "https://omega-clarity-379009-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "omega-clarity-379009",
  storageBucket: "omega-clarity-379009.appspot.com",
  messagingSenderId: "367699025625",
  appId: "1:367699025625:web:4deda6d18bc81ad6e168c8",
  measurementId: "G-6RWQL42FW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;