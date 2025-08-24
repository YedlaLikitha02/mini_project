// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
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

const login = document.getElementById('login-btn');
login.addEventListener("click", function (event) {
    event.preventDefault()
  
    //inputs
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login Successful!")
            // Signed in
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId',user.uid);
            window.location.href = "index.html";
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
            // ..
        });

})