const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};


// domcontentloaded
window.addEventListener("DOMContentLoaded", async () => {
    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();

    auth.onAuthStateChanged(async user => {
        if (user) {
            let uid = user.uid;
            let userData = await db.collection("users").doc(uid).get();
            let data = userData.data();

            let requests = await db.collection("requests")
                .where('uid', "!=", uid)
                .where('status', "==", "verified")
                .where('bloodGroup', "==", data.bloodGroup)
                .where('city', "==", data.city)
                .get();

            let requstsData = requests.docs.map(doc => doc.data());
            for (let request of requstsData) {
                let p = `<li class="collection-item avatar">`
            }

        } else {
            window.location.href = "login.html";
        }
    })
});
