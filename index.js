// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  
// Add Firebase products that you want to use
import { auth } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js'
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import { firestore } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js'

const firebaseConfig = {

	apiKey: "AIzaSyBaaMDEZSfrBule95n_y0RcbnzdVtz6Fp8",
	
	authDomain: "wedding-asep-nabila.firebaseapp.com",
	
	projectId: "wedding-asep-nabila",
	
	storageBucket: "wedding-asep-nabila.appspot.com",
	
	messagingSenderId: "12760851327",
	
	appId: "1:12760851327:web:dab336f27bb009bd4bf04a",
	
	measurementId: "G-77YBSBL6PY"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);