// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import{getFirestore, setDoc, doc}from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsKSV7QFTN9WsCs8J_R6C7JyUesK213gU",
  authDomain: "miniproject-afac8.firebaseapp.com",
  projectId: "miniproject-afac8",
  storageBucket: "miniproject-afac8.firebasestorage.app",
  messagingSenderId: "383316627396",
  appId: "1:383316627396:web:9ea6ef346f2465cb0c5e91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getFirestore();
const register = document.getElementById('register-btn');
register.addEventListener("click", function (event) {
  event.preventDefault()

  //inputs
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
 

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      const userData={
        email: email,
        password: password,
      };
    
      alert("Registration Successful!")

      const docRef=doc(db,"users",user.uid);
      setDoc(docRef,userData)
      .then(()=>{
        window.location.href="Mainpage.html";
      })
      // ...
      .catch((error)=>{
        console.error("error writing document",error);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)

      // ..
    });

})
