// ✅ Import Firebase SDK correctly
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsKSV7QFTN9WsCs8J_R6C7JyUesK213gU",
    authDomain: "miniproject-afac8.firebaseapp.com",
    projectId: "miniproject-afac8",
    storageBucket: "miniproject-afac8.firebasestorage.app",
    messagingSenderId: "383316627396",
    appId: "1:383316627396:web:9ea6ef346f2465cb0c5e91"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Export Firestore `db` to use in other files
export { db };
