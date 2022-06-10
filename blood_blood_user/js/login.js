// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// let register = document.getElementById("loginSubmit");
let login = document.getElementById("login");

const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};

let app = firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();
let db = firebase.firestore();
console.log(db);

login.addEventListener("click", (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password).then(credentials => {
        let user = credentials.user;
        if (user.uid != null) {
            window.location.href = "/home.html";
        }
    }).catch(err => {
        new M.Toast({
            html: err.message,
        })
        console.log(err);
    })
});




// DOmContententLoadedEvent
// Language: javascript

window.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(function (user) {
        if (user) {
            if (user.uid != null) {
                window.location.href = "/home.html";
            }
        } else {
            // No user is signed in.
        }
    });
});